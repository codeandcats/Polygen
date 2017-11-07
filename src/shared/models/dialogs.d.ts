import { Size } from './size';

export interface Dialogs {
	newProjectFile: {
		dimensions: Size;
		isVisible: boolean;
	},
	visibleNativeDialogCount: number;
	visibleWebDialogCount: number;
}
