import * as clone from 'clone';
import { app, remote } from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';
import { fileExists, mkdir } from '../utils/fileSystem';
import { PRODUCT_NAME } from './productName';

export interface Settings {
	recentFileNames: string[];
}

export class SettingsFile {
	private static readonly DEFAULTS: Settings = {
		recentFileNames: []
	};

	private settingsFileName?: string = undefined;

	public getSettingsFileName(): string {
		if (!this.settingsFileName) {
			const application = app || remote.app;
			const appDataPath = application.getPath('appData');
			this.settingsFileName = path.join(appDataPath, PRODUCT_NAME, 'config.json');
		}
		return this.settingsFileName;
	}

	public async load(): Promise<Settings> {
		const fileName = this.getSettingsFileName();

		const doesFileExist = await fileExists(fileName);

		if (!doesFileExist) {
			return clone(SettingsFile.DEFAULTS);
		}

		const json = await fs.readFile(fileName, 'utf8');

		const result = JSON.parse(json);

		return result;
	}

	public async save(settings: Settings): Promise<Settings> {
		const fileName = await this.getSettingsFileName();

		settings = { ...settings };

		const json = JSON.stringify(settings, null, '\t');

		await mkdir(path.dirname(fileName));

		await fs.writeFile(fileName, json, { encoding: 'utf8' });

		return settings;
	}
}

export default new SettingsFile();
