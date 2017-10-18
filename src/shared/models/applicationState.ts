import { Editor } from './editor';
import { ProjectFile } from './projectFile';
import { ViewPort } from './viewPort';

export interface ApplicationState {
	activeEditorIndex: number;
	editors: Editor[];
	recentFileNames: string[];
	viewPort: ViewPort;
}

export const DEFAULT_APPLICATION_STATE: ApplicationState = {
	activeEditorIndex: -1,
	editors: [],
	recentFileNames: [],
	viewPort: {
		zoom: 1,
		pan: {
			x: 0,
			y: 0
		}
	}
};
