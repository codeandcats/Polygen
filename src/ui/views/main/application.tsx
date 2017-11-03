import { Menu, MenuItem, MenuItemConstructorOptions, OpenDialogOptions, remote, SaveDialogOptions } from 'electron';
import * as fs from 'fs-extra';
import * as jQuery from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FluxMenuItemDefinition, FluxMenuRenderer } from '../../../shared/fluxMenu';
import { ApplicationState } from '../../../shared/models/applicationState';
import { Editor } from '../../../shared/models/editor';
import { Nullable } from '../../../shared/models/nullable';
import { PolygenDocument } from '../../../shared/models/polygenDocument';
import settingsFile from '../../../shared/models/settings';
import { closeActiveProjectFile } from '../../actions/editor/closeActiveProjectFile';
import { updatePolygonColors } from '../../actions/editor/document/layer/polygons/updatePolygonColors';
import { openExistingProjectFile } from '../../actions/editor/openExistingProjectFile';
import { openNewProjectFile } from '../../actions/editor/openNewProjectFile';
import { saveActiveProjectFile } from '../../actions/editor/saveActiveProjectFile';
import { loadSettings } from '../../actions/loadSettings';
import { showNewProjectFileDialog } from '../../actions/showNewProjectFileDialog';
import { switchToEditor } from '../../actions/switchToEditor';
import { Store } from '../../reduxWithLessSux/store';
import { MainWindow } from './index';

export class Application {
	private readonly MENU_DEFINITIONS: Array<FluxMenuItemDefinition<ApplicationState>> = [
		{
			label: 'Polygen',
			submenu: [
				{
					role: 'quit'
				}
			]
		},
		{
			label: 'File',
			submenu: [
				{
					accelerator: 'CmdOrCtrl+N',
					label: 'New',
					click: () => this.openNewProjectFile()
				},
				{
					type: 'separator'
				},
				{
					accelerator: 'CmdOrCtrl+O',
					label: 'Open...',
					click: () => this.openProjectFile()
				},
				{
					type: 'separator'
				},
				{
					accelerator: 'CmdOrCtrl+S',
					label: 'Save',
					click: () => this.saveProjectFile()
				},
				{
					accelerator: 'CmdOrCtrl+Shift+S',
					label: 'Save As...',
					click: () => this.saveProjectFileAs()
				},
				{
					type: 'separator'
				},
				{
					accelerator: 'CmdOrCtrl+W',
					label: 'Close',
					click: () => this.closeProjectFile()
				}
			]
		},
		{
			label: 'Debug',
			submenu: [
				{
					role: 'copy'
				},
				{
					role: 'paste'
				},
				{
					role: 'reload'
				},
				{
					role: 'toggledevtools'
				},
				{
					accelerator: 'CmdOrCtrl+U',
					label: 'Update Polygon Colors',
					click: () => {
						const editorView = this.mainWindow && this.mainWindow.getEditorView();
						if (editorView) {
							editorView.updatePolygonColors();
						}
					},
					enabled: state => state.activeEditorIndex !== -1
				}
			]
		}
	];

	private mainWindow: Nullable<MainWindow>;

	private menu = new FluxMenuRenderer<ApplicationState>({
		definitions: this.MENU_DEFINITIONS
	});

	constructor(globals: any, private store: Store<ApplicationState>) {
		this.initialise(globals);
	}

	private async initialise(globals: any): Promise<void> {
		this.attachJQuery(globals);

		const settings = await settingsFile.load();

		loadSettings(this.store, {
			settings
		});

		const container = document.getElementById('content') as HTMLElement;

		let previousRecentFileNames = this.store.getState().recentFileNames;

		this.store.subscribe(() => {
			ReactDOM.render(
				<MainWindow
					onOpenProjectFile={ fileName => this.openExactProjectFile(fileName) }
					onShowNewProjectFileDialog={ () => this.openNewProjectFile() }
					onShowOpenProjectFileDialog={ () => this.openProjectFile() }
					ref={ mainWindow => this.mainWindow = mainWindow }
					store={this.store}
				/>,
				container
			);

			const state = this.store.getState();
			this.menu.update(state);

			if (previousRecentFileNames.join(',') !== state.recentFileNames.join(',')) {
				previousRecentFileNames = [...state.recentFileNames];
				settingsFile.save({
					recentFileNames: state.recentFileNames
				});
			}
		});
	}

	private attachJQuery(globals: any) {
		globals.$ = jQuery;
		globals.jQuery = jQuery;
	}

	public closeProjectFile() {
		closeActiveProjectFile(this.store);
	}

	private getEditorIndexOfProjectFile(fileName: string): number {
		const state = this.store.getState();
		return state.editors.findIndex(editor => editor.fileName === fileName);
	}

	public async openProjectFile(): Promise<void> {
		return new Promise<string | undefined>(resolve => {
			const window = remote.getCurrentWindow();
			const options: OpenDialogOptions = {
				filters: [
					{
						extensions: ['plg'],
						name: 'Polygen Files'
					}
				]
			};
			remote.dialog.showOpenDialog(
				window,
				options,
				fileNames => resolve(fileNames && fileNames[0])
			);
		})
		.then(fileName => {
			if (fileName) {
				return this.openExactProjectFile(fileName);
			}
		});
	}

	private async openExactProjectFile(fileName: string): Promise<void> {
		const state = this.store.getState();
		const editorIndex = this.getEditorIndexOfProjectFile(fileName);
		if (editorIndex > -1) {
			switchToEditor(this.store, { editorIndex });
		} else {
			return fs
				.readFile(fileName, { encoding: 'utf8' })
				.then(json => {
					const document: PolygenDocument = JSON.parse(json);
					openExistingProjectFile(this.store, {
						fileName,
						document
					});
				});
		}
	}

	public openNewProjectFile(): void {
		showNewProjectFileDialog(this.store);
	}

	public async saveProjectFileAs(): Promise<void> {
		const state = this.store.getState();
		const editor = state.editors[state.activeEditorIndex];
		if (!editor) {
			return;
		}

		return new Promise<string | undefined>(resolve => {
			const window = remote.getCurrentWindow();
			const options: SaveDialogOptions = {
				filters: [
					{
						extensions: ['plg'],
						name: 'Polygen Files'
					}
				]
			};
			remote.dialog.showSaveDialog(
				window,
				options,
				fileName => resolve(fileName)
			);
		}).then(fileName => {
			if (fileName) {
				return this.saveExactProjectFile(editor, fileName);
			}
		});
	}

	public async saveProjectFile(): Promise<void> {
		const state = this.store.getState();
		const editor = state.editors[state.activeEditorIndex];
		if (!editor) {
			return;
		}

		const fileName = await (editor.fileName || this.saveProjectFileAs());

		if (!fileName) {
			return;
		}

		await this.saveExactProjectFile(editor, fileName);
	}

	private async saveExactProjectFile(editor: Editor, fileName: string): Promise<void> {
		const json = JSON.stringify(editor.document, null, '\t');
		await fs.writeFile(fileName, json, { encoding: 'utf8' });
		await saveActiveProjectFile(this.store, { fileName });
	}
}
