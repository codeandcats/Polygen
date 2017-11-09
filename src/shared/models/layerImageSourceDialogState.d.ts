import { ImageSource } from './imageSource';
import { Nullable } from './nullable';

export interface LayerImageSourceDialogState {
	dialogType: 'layerImageSource';
	layerIndex: number;
	imageSource: Nullable<ImageSource>;
}
