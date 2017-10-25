import b64toBlob from 'b64-to-blob';
import * as uuid from 'uuid/v4';
import { ImageSource } from '../../shared/models/imageSource';

interface CachedImage {
	blob: Blob;
	element: HTMLImageElement;
	objectUrl: string;
}

export class ImageCache {
	private cache: { [id: string]: CachedImage } = {};

	public clear() {
		const ids = Object.getOwnPropertyNames(this.cache);
		for (const id of ids) {
			this.remove(id);
		}
	}

	private remove(id: string) {
		const item = this.cache[id];
		if (item) {
			item.element.src = '';
			URL.revokeObjectURL(item.objectUrl);
			delete this.cache[id];
		}
	}

	public getImage(imageSource: ImageSource): CachedImage {
		let item: CachedImage | undefined = this.cache[imageSource.id];

		if (!item) {
			const blob = b64toBlob(imageSource.data);
			const objectUrl = URL.createObjectURL(blob);
			const element = document.createElement('img');
			element.src = objectUrl;

			item = {
				blob,
				element,
				objectUrl
			};
		}

		return item;
	}
}
