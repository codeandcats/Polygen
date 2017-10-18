import * as appRootPath from 'app-root-path';
import { app, BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { Untyped } from '../shared/models/untyped';

export class Application {
	private mainWindow: BrowserWindow | undefined;

	constructor() {
		app.setName('Polygen');
		this.subscribeToEvents();
	}

	private createMainMenu() {
		const menu = Menu.buildFromTemplate(this.getMenuTemplate());
		Menu.setApplicationMenu(menu);
	}

	private createMainWindow() {
		this.mainWindow = new BrowserWindow({
			width: 1280,
			height: 720
		});

		this.mainWindow.loadURL(url.format({
			pathname: appRootPath.resolve('./src/ui/views/main/index.html'),
			protocol: 'file:',
			slashes: true
		}));

		this.mainWindow.on('closed', () => {
			this.mainWindow = undefined;
		});

		this.mainWindow.show();
	}

	private getMenuTemplate(): MenuItemConstructorOptions[] {
		return [
			{
				label: app.getName(),
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
						label: 'New',
						click: () => {
							// Create a new file
						}
					},
					{
						type: 'separator'
					},
					{
						label: 'Open...',
						click: () => {
							// Open a file
						}
					},
					{
						type: 'separator'
					},
					{
						label: 'Save',
						click: () => {
							// Save file
						}
					},
					{
						label: 'Save As...',
						click: () => {
							// Save file as
						}
					},
					{
						type: 'separator'
					},
					{
						label: 'Close',
						click: () => {
							// Close file
						}
					}
				]
			},
			{
				label: 'Debug',
				submenu: [
					{
						role: 'reload'
					},
					{
						role: 'toggledevtools'
					}
				]
			}
		];
	}

	private subscribeToEvents() {
		app.on('window-all-closed', () => {
			if (process.platform === 'darwin') {
				app.quit();
			}
		});

		app.on('ready', () => {
			this.createMainMenu();
			this.createMainWindow();
		});

		app.on('activate', () => {
			if (this.mainWindow === null) {
				this.createMainWindow();
			}
		});
	}
}
