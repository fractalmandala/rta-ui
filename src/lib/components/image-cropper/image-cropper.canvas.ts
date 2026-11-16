import {
	applyCropExportTransform,
	getCropOutputSize,
	type CropExportParams,
	type Size
} from './crop';

export type CroppedImageOutput = Blob | string | null;

/**
 * Draws the cropped image to an offscreen canvas. Returns `null` wherever the canvas cannot be
 * created or read — a missing 2d context, a tainted canvas, or an unsized output.
 */
export function drawCroppedImageToCanvas(
	image: HTMLImageElement | null,
	params: CropExportParams,
	maxSize?: Size
): HTMLCanvasElement | null {
	if (!image || !image.complete) return null;
	const outputSize = getCropOutputSize(params, maxSize);
	try {
		const canvas = image.ownerDocument.createElement('canvas');
		canvas.width = outputSize.width;
		canvas.height = outputSize.height;
		if (canvas.width !== outputSize.width || canvas.height !== outputSize.height) return null;
		const ctx = canvas.getContext('2d');
		if (!ctx) return null;
		applyCropExportTransform(ctx, params, outputSize);
		ctx.drawImage(image, 0, 0);
		return canvas;
	} catch {
		return null;
	}
}

export function canvasToBlob(
	canvas: HTMLCanvasElement,
	type = 'image/png',
	quality = 1
): Promise<Blob | null> {
	return new Promise((resolve) => {
		canvas.toBlob(resolve, type, quality);
	});
}
