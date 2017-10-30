import { BrowserWindow } from 'electron';
import { Accelerator, app, ipcMain, ipcRenderer, Menu, MenuItem, MenuItemConstructorOptions, remote } from 'electron';

type MenuItemValueProvider<TState, TValue> = ((state: TState) => TValue) | TValue;

export type MenuType = 'normal' | 'separator' | 'submenu' | 'checkbox' | 'radio';

const IPC_EVENT_NAMES = {
	RUN: 'FLUX_MENU.RUN',
	UPDATE: 'FLUX_MENU.UPDATE'
};

export interface FluxMenuItemDefinition<TState> {
	accelerator?: Accelerator;
	checked?: MenuItemValueProvider<TState, boolean>;
	click?: () => void;
	enabled?: MenuItemValueProvider<TState, boolean>;
	label?: MenuItemValueProvider<TState, string>;
	role?: string;
	sublabel?: string;
	submenu?: Array<FluxMenuItemDefinition<TState>>;
	type?: MenuType;
	visible?: MenuItemValueProvider<TState, boolean>;
}

export interface FluxMenuItemDefinitionWithId<TState> extends FluxMenuItemDefinition<TState> {
	id: string;
	submenu?: Array<FluxMenuItemDefinitionWithId<TState>>;
}

export interface FluxMenuItemState {
	accelerator?: Accelerator;
	checked?: boolean;
	enabled?: boolean;
	label?: string;
	role?: string;
	sublabel?: string;
	submenu?: FluxMenuItemState[];
	type?: MenuType;
	visible?: boolean;
}

export interface FluxMenuItemStateWithId extends FluxMenuItemState {
	id: string;
	submenu?: FluxMenuItemStateWithId[];
}

interface FluxMenuUpdatePayload {
	browserWindowId: number;
	namespace: string | undefined;
	menus: FluxMenuItemStateWithId[];
}

interface FluxMenuRunPayload {
	namespace: string | undefined;
	menuItemId: string;
}

function walkMenuItems<T extends { submenu?: T[] }>(items: T[], callback: (item: T) => boolean | void) {
	for (const item of items) {
		let shouldContinue = callback(item);

		if (shouldContinue === false) {
			return;
		}

		if (item.submenu) {
			shouldContinue = walkMenuItems(item.submenu, callback);

			// For some reason compiler complains without the boolean type check on next line
			// when it doesn't complain on same check without it just a few lines up
			if (typeof shouldContinue === 'boolean' && !shouldContinue) {
				return;
			}
		}
	}
}

function getDefinitionsWithIds<TState>(
	definitions: Array<FluxMenuItemDefinition<TState>>,
	options?: { fromId: number }
): Array<FluxMenuItemDefinitionWithId<TState>> {
	options = options || { fromId: 0 };
	const result = definitions.map(definition => {
		const id = '' + (options as { fromId: number }).fromId++;
		const submenu = definition.submenu && getDefinitionsWithIds(definition.submenu, options);
		const itemWithId: FluxMenuItemDefinitionWithId<TState> = {
			...definition,
			id,
			submenu
		};

		return itemWithId;
	});

	return result;
}

function getDefinitionValue<TState, TKey extends keyof FluxMenuItemDefinition<TState>>(
	definition: FluxMenuItemDefinition<TState>,
	state: TState,
	key: TKey
): any {
	const provider = definition[key];
	if (typeof provider === 'function') {
		return (provider as MenuItemValueProvider<TState, any>)(state);
	}
	return provider;
}

function getMenuState<TState>(
	definition: FluxMenuItemDefinitionWithId<TState>,
	state: TState
): FluxMenuItemStateWithId {
	const result: FluxMenuItemStateWithId = {
		id: definition.id
	};

	const keys: Array<keyof FluxMenuItemDefinition<TState>> = [
		'accelerator',
		'label',
		'checked',
		'enabled',
		'label',
		'role',
		'sublabel',
		'type',
		'visible'
	];

	for (const key of keys) {
		const value = getDefinitionValue(definition, state, key);
		if (value !== undefined) {
			(result as any)[key] = value;
		}
	}

	if (definition.submenu && definition.submenu.length) {
		result.submenu = definition.submenu.map(childDefinition => getMenuState(childDefinition, state));
	}

	return result;
}

export class FluxMenuRenderer<TState> {
	private browserWindowId: number = remote.getCurrentWindow().id;
	private namespace: string | undefined;
	private definitions: Array<FluxMenuItemDefinitionWithId<TState>> = [];
	private definitionsById: { [id: string]: FluxMenuItemDefinitionWithId<TState>; } = {};

	constructor(options: { definitions: Array<FluxMenuItemDefinition<TState>>, namespace?: string }) {
		this.namespace = options.namespace || undefined;
		this.definitions = getDefinitionsWithIds(options.definitions);
		walkMenuItems(this.definitions, definition => {
			this.definitionsById[definition.id] = definition;
		});

		ipcRenderer.on(IPC_EVENT_NAMES.RUN, (_: any, payload: FluxMenuRunPayload) => {
			if (payload.namespace === this.namespace) {
				const definition = this.definitionsById[payload.menuItemId];
				if (definition.click) {
					definition.click();
				}
			}
		});
	}

	public update(state: TState) {
		const payload: FluxMenuUpdatePayload = {
			namespace: this.namespace,
			browserWindowId: this.browserWindowId,
			menus: this.definitions.map(definition => getMenuState(definition, state))
		};

		// TODO: Only send differences
		ipcRenderer.send(IPC_EVENT_NAMES.UPDATE, payload);
	}
}

export class FluxMenuMain {
	private menu: Menu | undefined;
	private namespace: string | undefined;
	private menuItemsById: { [id: string]: MenuItem } = {};
	private isAppReady: boolean = false;

	constructor(options?: { namespace?: string }) {
		this.namespace = (options && options.namespace) || undefined;

		ipcMain.on(IPC_EVENT_NAMES.UPDATE, (_: any, payload: FluxMenuUpdatePayload) => {
			if (payload.namespace === this.namespace) {
				this.updateMenus(payload.browserWindowId, payload.menus);
			}
		});

		app.on('ready', () => {
			this.isAppReady = true;
			if (this.menu) {
				Menu.setApplicationMenu(this.menu);
			}
		});
	}

	private updateMenus(browserWindowId: number, menuState: FluxMenuItemStateWithId[]) {
		const updateMenuItem = (menuItem: MenuItem, state: FluxMenuItemStateWithId) => {
			if (state.checked !== undefined) {
				menuItem.checked = state.checked;
			}
			if (state.enabled !== undefined) {
				menuItem.enabled = state.enabled;
			}
			if (state.label !== undefined) {
				menuItem.label = state.label;
			}
			if (state.visible !== undefined) {
				menuItem.visible = state.visible;
			}
		};

		if (!this.menu) {
			const menuItemStatesToMenu = (menuItemStates: FluxMenuItemStateWithId[]): Menu => {
				const menu = new Menu();
				for (const menuItemState of menuItemStates) {
					const options = {
						accelerator: menuItemState.accelerator,
						click: () => this.runMenuItem(browserWindowId, menuItemState.id),
						id: menuItemState.id,
						role: menuItemState.role,
						submenu: menuItemState.submenu && menuItemStatesToMenu(menuItemState.submenu),
						sublabel: menuItemState.sublabel,
						type: menuItemState.type
					};
					for (const key of ['accelerator', 'click', 'id', 'role', 'submenu', 'sublabel', 'type']) {
						if ((options as any)[key] === undefined) {
							delete (options as any)[key];
						}
					}
					const menuItem = new MenuItem(options);
					updateMenuItem(menuItem, menuItemState);
					this.menuItemsById[menuItemState.id] = menuItem;
					menu.append(menuItem);
				}
				return menu;
			};

			this.menuItemsById = {};
			this.menu = menuItemStatesToMenu(menuState);
			if (this.isAppReady) {
				Menu.setApplicationMenu(this.menu);
			}
		} else {
			walkMenuItems(menuState, menuItemState => {
				const menuItem = this.menuItemsById[menuItemState.id];
				updateMenuItem(menuItem, menuItemState);
			});
		}
	}

	private runMenuItem(browserWindowId: number, menuItemId: string) {
		const payload: FluxMenuRunPayload = {
			namespace: this.namespace,
			menuItemId
		};
		const browserWindow = BrowserWindow.fromId(browserWindowId);
		browserWindow.webContents.send(IPC_EVENT_NAMES.RUN, payload);
	}
}

// class FluxMenuItem<TState> {
// 	private menuItem: MenuItem;
// 	private subMenuItems: Array<FluxMenuItem<TState>> = [];

// 	constructor(private definition: FluxMenuItemDefinition<TState>) {
// 		this.menuItem = new MenuItem({});
// 		this.subMenuItems = (
// 			definition.submenu ?
// 			definition.submenu.map(subMenuItemDefinition => new FluxMenuItem(subMenuItemDefinition)) :
// 			[]
// 		);
// 	}

// 	public getMenuItem() {
// 		return this.menuItem;
// 	}

// 	private getValue<TValue>(state: TState, provider: MenuItemValueProvider<TState, TValue>): TValue {
// 		if (typeof provider === 'function') {
// 			return provider(state);
// 		}
// 		return provider;
// 	}

// 	private updateValue<TKey extends keyof MenuItem>(
// 		key: TKey,
// 		provider: MenuItemValueProvider<TState, MenuItem[TKey]> | undefined | null,
// 		state: TState) {

// 		if (provider == null) {
// 			return;
// 		}

// 		const value = this.getValue(state, provider);

// 		this.menuItem[key] = value;
// 	}

// 	public update(state: TState) {
// 		this.updateValue('label', this.definition.label, state);
// 		this.updateValue('enabled', this.definition.enabled, state);
// 		this.updateValue('checked', this.definition.checked, state);
// 		this.updateValue('visible', this.definition.visible, state);

// 		for (const subMenuItem of this.subMenuItems) {
// 			subMenuItem.update(state);
// 		}
// 	}
// }

// export class FluxMenu<TState> {
// 	private menu = new Menu();
// 	private menuItems: Array<FluxMenuItem<TState>> = [];

// 	constructor(definitions: Array<FluxMenuItemDefinition<TState>>) {
// 		this.menuItems = definitions.map(definition => new FluxMenuItem(definition));
// 		this.menu.items.push(...this.menuItems.map(item => item.getMenuItem()));
// 	}

// 	public getMenu() {
// 		return this.menu;
// 	}

// 	public update(state: TState) {
// 		for (const menuItem of this.menuItems) {
// 			menuItem.update(state);
// 		}
// 	}
// }
