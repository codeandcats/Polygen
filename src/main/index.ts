import * as appRootPath from 'app-root-path';
import { app, BrowserWindow, Menu } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { Untyped } from '../shared/models/untyped';

let mainWindow: BrowserWindow | undefined;

function createMainWindow() {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720
	});

	mainWindow.loadURL(url.format({
		pathname: appRootPath.resolve('./src/ui/views/main/index.html'),
		protocol: 'file:',
		slashes: true
	}));

	mainWindow.on('closed', () => {
		mainWindow = undefined;
	});

	mainWindow.show();
}

app.on('window-all-closed', () => {
	if (process.platform === 'darwin') {
		app.quit();
	}
});

app.on('ready', () => {
	createMainWindow();
});

app.on('activate', () => {
	if (mainWindow === null) {
		createMainWindow();
	}
});
