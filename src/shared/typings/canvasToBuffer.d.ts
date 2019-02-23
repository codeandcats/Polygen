declare module 'canvas-to-buffer' {
	type FloatPercent = number;

	type ImageType = 'jpeg' | 'png' | 'webp';

	interface CanvasToBufferOptions {
		quality: FloatPercent;
		image?: {
			types?: ImageType[];
		}
	}

	class Frame {
		constructor(canvas: HTMLCanvasElement, options?: CanvasToBufferOptions);
		toBuffer(): Buffer;
	}

	export = Frame;
}
