import { Size } from './size';
import { Nullable } from './nullable';

export interface NewProjectFileDialogState {
	dialogType: 'newProjectFile';
	dimensions: {
		width: Nullable<string | number>;
		height: Nullable<string | number>;
	}
}
