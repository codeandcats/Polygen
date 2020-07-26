import * as appRootPath from 'app-root-path';
import { app, BrowserWindow } from 'electron';
import * as url from 'url';
import { FluxMenuMain } from '../shared/fluxMenu/index';

export class Application {
  private mainWindow: BrowserWindow | undefined;
  private menu: FluxMenuMain = new FluxMenuMain();

  constructor() {
    app.setName('Polygen');
    this.subscribeToEvents();
  }

  private createMainWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1000,
      height: 900,
      minWidth: 800,
      minHeight: 500,
    });

    this.mainWindow.loadURL(
      url.format({
        pathname: appRootPath.resolve('./src/ui/views/main/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );

    this.mainWindow.on('closed', () => {
      this.mainWindow = undefined;
    });

    this.mainWindow.show();
  }

  private subscribeToEvents() {
    app.on('window-all-closed', () => {
      if (process.platform === 'darwin') {
        app.quit();
      }
    });

    app.on('ready', () => {
      if (!this.mainWindow) {
        this.createMainWindow();
      }
    });

    app.on('activate', () => {
      if (!this.mainWindow) {
        this.createMainWindow();
      }
    });
  }
}
