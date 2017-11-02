import { Dialogs } from './dialogs';
import { Editor } from './editor';
import { PolygenDocument } from './polygenDocument';
import { ViewPort } from './viewPort';

export interface ApplicationState {
	activeEditorIndex: number;
	dialogs: Dialogs;
	editors: Editor[];
	recentFileNames: string[];
	viewPort: ViewPort;
}

export const DEFAULT_APPLICATION_STATE: ApplicationState = {
	activeEditorIndex: -1,
	dialogs: {
		newProjectFile: {
			dimensions: {
				width: 200,
				height: 300
			},
			isVisible: false
		}
	},
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

export const MAX_RECENT_FILE_NAME_COUNT = 10;
