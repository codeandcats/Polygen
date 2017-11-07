import { Menu, MenuItem, MenuItemConstructorOptions, OpenDialogOptions, remote, SaveDialogOptions } from 'electron';
import * as fs from 'fs-extra';
import * as jQuery from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FluxMenuItemDefinition, FluxMenuRenderer } from '../../../shared/fluxMenu';
import { ApplicationState, areDialogsVisible, isEditorVisible } from '../../../shared/models/applicationState';
import { Editor } from '../../../shared/models/editor';
import { Nullable } from '../../../shared/models/nullable';
import { PolygenDocument } from '../../../shared/models/polygenDocument';
import settingsFile from '../../../shared/models/settings';
import { closeActiveProjectFile } from '../../actions/editor/closeActiveProjectFile';
import { deselectAllPoints } from '../../actions/editor/document/layer/points/deselectAllPoints';
import { removeSelection } from '../../actions/editor/document/layer/points/removeSelection';
import { selectAllPoints } from '../../actions/editor/document/layer/points/selectAllPoints';
import { selectNearestPoint } from '../../actions/editor/document/layer/points/selectNearestPoint';
import { updatePolygonColors } from '../../actions/editor/document/layer/polygons/updatePolygonColors';
import { openExistingProjectFile } from '../../actions/editor/openExistingProjectFile';
import { openNewProjectFile } from '../../actions/editor/openNewProjectFile';
import { saveActiveProjectFile } from '../../actions/editor/saveActiveProjectFile';
import { focusedElementChanged, isElementAnInput, isElementATextInput } from '../../actions/focusedElementChanged';
import { loadSettings } from '../../actions/loadSettings';
import { nativeDialogDidHide } from '../../actions/nativeDialogDidHide';
import { nativeDialogWillShow } from '../../actions/nativeDialogWillShow';
import { showNewProjectFileDialog } from '../../actions/showNewProjectFileDialog';
import { switchToEditor } from '../../actions/switchToEditor';
import { Store } from '../../reduxWithLessSux/store';
import { canElementDelete, canElementSelectAll } from '../../utils/forms';
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
					click: () => this.openNewProjectFile(),
					enabled: state => !areDialogsVisible(state)
				},
				{
					type: 'separator'
				},
				{
					accelerator: 'CmdOrCtrl+O',
					label: 'Open...',
					click: () => this.openProjectFile(),
					enabled: state => !areDialogsVisible(state)
				},
				{
					type: 'separator'
				},
				{
					accelerator: 'CmdOrCtrl+S',
					label: 'Save',
					click: () => this.saveProjectFile(),
					enabled: state => isEditorVisible(state) && !areDialogsVisible(state)
				},
				{
					accelerator: 'CmdOrCtrl+Shift+S',
					label: 'Save As...',
					click: () => this.saveProjectFileAs(),
					enabled: state => isEditorVisible(state) && !areDialogsVisible(state)
				},
				{
					type: 'separator'
				},
				{
					accelerator: 'CmdOrCtrl+W',
					label: 'Close',
					click: () => this.closeProjectFile(),
					enabled: state => isEditorVisible(state) && !areDialogsVisible(state)
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
					enabled: state => isEditorVisible(state) && !areDialogsVisible(state)
				}
			]
		},
		{
			label: 'Selection',
			submenu: [
				{
					accelerator: 'CmdOrCtrl+A',
					label: 'Select All',
					click: () => {
						if (document.activeElement && canElementSelectAll(document.activeElement)) {
							(document.activeElement as HTMLInputElement).select();
						} else {
							selectAllPoints(this.store);
						}
					},
					enabled: state => !areDialogsVisible(state) && !state.focusedElement.isTextInput
				},
				{
					accelerator: 'CmdOrCtrl+D',
					label: 'Deselect',
					click: () => deselectAllPoints(this.store),
					enabled: state => !areDialogsVisible(state)
				},
				{
					type: 'separator'
				},
				{
					accelerator: 'Backspace',
					label: 'Delete',
					click: () => {
						if (document.activeElement && canElementDelete(document.activeElement)) {
							$(document.activeElement).val('');
						} else {
							const editorView = this.mainWindow && this.mainWindow.getEditorView();
							if (editorView) {
								editorView.removeSelection();
							}
						}
					},
					enabled: state => !areDialogsVisible(state) && !state.focusedElement.isTextInput
				},
				{
					label: 'Select',
					submenu: [
						{
							accelerator: 'Alt+Up',
							label: 'Point above',
							click: () => selectNearestPoint(this.store, { direction: 'up' }),
							enabled: state => !areDialogsVisible(state) && !state.focusedElement.isInput
						},
						{
							accelerator: 'Alt+Down',
							label: 'Point below',
							click: () => selectNearestPoint(this.store, { direction: 'down' }),
							enabled: state => !areDialogsVisible(state) && !state.focusedElement.isInput
						},
						{
							accelerator: 'Alt+Left',
							label: 'Point to the left',
							click: () => selectNearestPoint(this.store, { direction: 'left' }),
							enabled: state => !areDialogsVisible(state) && !state.focusedElement.isInput
						},
						{
							accelerator: 'Alt+Right',
							label: 'Point to the right',
							click: () => selectNearestPoint(this.store, { direction: 'right' }),
							enabled: state => !areDialogsVisible(state) && !state.focusedElement.isInput
						}
					]
				}
			]
		}
	];

	private mainWindow: Nullable<MainWindow>;

	private menu = new FluxMenuRenderer<ApplicationState>({
		definitions: this.MENU_DEFINITIONS
	});

	private nativeDialogDidHide = () => {
		nativeDialogDidHide(this.store);
	}

	private nativeDialogWillShow = () => {
		nativeDialogWillShow(this.store);
	}

	constructor(globals: any, private store: Store<ApplicationState>) {
		this.initialise(globals);
	}

	private async initialise(globals: any): Promise<void> {
		this.attachJQuery(globals);

		const settings = await settingsFile.load();

		loadSettings(this.store, {
			settings
		});

		window.addEventListener('focus', this.focusedElementChanged, true);

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

	private focusedElementChanged = () => {
		const state = this.store.getState();

		const isInput = isElementAnInput(document.activeElement);
		const isTextInput = isElementATextInput(document.activeElement);

		if (state.focusedElement.isInput !== isInput || state.focusedElement.isTextInput !== isTextInput) {
			focusedElementChanged(this.store, { isInput, isTextInput });
		}
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
			this.nativeDialogWillShow();
			remote.dialog.showOpenDialog(
				window,
				options,
				fileNames => resolve(fileNames && fileNames[0])
			);
		})
		.then(fileName => {
			this.nativeDialogDidHide();
			if (fileName) {
				return this.openExactProjectFile(fileName);
			}
		}, this.nativeDialogDidHide);
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
			this.nativeDialogWillShow();
			remote.dialog.showSaveDialog(
				window,
				options,
				fileName => resolve(fileName)
			);
		}).then(fileName => {
			this.nativeDialogDidHide();
			if (fileName) {
				return this.saveExactProjectFile(editor, fileName);
			}
		}, this.nativeDialogDidHide);
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
