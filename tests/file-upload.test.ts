import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import Phase6FileUpload from './harness/Phase6FileUpload.svelte';

const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
	document.querySelector(selector) as T | null;
const $$ = (selector: string) => Array.from(document.querySelectorAll<HTMLElement>(selector));

const root = () => $('[data-scope="file-upload"][data-part="root"]')!;
const dropzone = () => $('[data-part="dropzone"]')!;
const hiddenInput = () => $<HTMLInputElement>('input[type="file"]')!;
const itemNames = () => $$('[data-part="item-name"]').map((node) => node.textContent?.trim());

const makeFile = (name: string, type: string, size = 16) =>
	new File([new Uint8Array(size)], name, { type });

const dataTransferFor = (files: File[]) => ({
	types: ['Files'],
	dropEffect: 'none',
	items: files.map((file) => ({ kind: 'file', type: file.type, getAsFile: () => file }))
});

describe('FileUpload', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	test('renders every anatomy part with scope, part and slot hooks', async () => {
		render(Phase6FileUpload, { props: { maxFiles: 2, testFiles: [makeFile('notes.txt', 'text/plain')] } });
		await fireEvent.click($('[data-testid="set-files"]')!);

		expect(root().getAttribute('data-slot')).toBe('file-upload-root');
		expect(root().id).toBe(hiddenInput().id.replace(':input', ''));
		expect(dropzone().getAttribute('data-slot')).toBe('file-upload-dropzone');
		expect(dropzone().getAttribute('role')).toBe('button');
		expect(dropzone().getAttribute('aria-label')).toBe('dropzone');
		expect(dropzone().tabIndex).toBe(0);
		expect($('[data-part="label"]')!.getAttribute('data-slot')).toBe('file-upload-label');
		expect($('[data-part="label"]')!.getAttribute('for')).toBe(hiddenInput().id);
		expect($('[data-part="dropzone-icon"]')!.getAttribute('aria-hidden')).toBe('true');
		expect($('[data-part="item-group"]')!.getAttribute('data-type')).toBe('accepted');
		expect($('[data-part="item"]')!.getAttribute('data-type')).toBe('accepted');
		expect($('[data-part="item"]')!.getAttribute('data-accepted')).toBe('');
		expect($('[data-part="item-name"]')!.textContent).toBe('notes.txt');
		expect($('[data-part="item-size-text"]')!.textContent).toMatch(/16/);
		expect($('[data-part="item-preview"]')!.getAttribute('data-slot')).toBe(
			'file-upload-item-preview'
		);
		expect($('[data-part="item-delete-trigger"]')!.getAttribute('aria-label')).toBe(
			'delete file notes.txt'
		);
		expect($('[data-part="item-delete-trigger"]')!.getAttribute('data-slot')).toBe(
			'file-upload-item-delete-trigger'
		);
		expect(hiddenInput().getAttribute('tabindex')).toBe('-1');
		expect(hiddenInput().getAttribute('aria-hidden')).toBe('true');
		expect(hiddenInput().style.position).toBe('absolute');
		expect(root().hasAttribute('data-disabled')).toBe(false);
		expect(root().hasAttribute('data-readonly')).toBe(false);
		expect(root().getAttribute('data-state')).not.toBe('dragging');
		expect(dropzone().hasAttribute('data-invalid')).toBe(false);
	});

	test('writes accept, multiple, capture and directory onto the hidden input', () => {
		const accepted = render(Phase6FileUpload, {
			props: { accept: ['image/png', '.pdf'], maxFiles: 3, capture: 'user', directory: true }
		});

		const input = accepted.container.querySelector<HTMLInputElement>('input[type="file"]')!;
		expect(input.accept).toBe('image/png,.pdf');
		expect(input.multiple).toBe(true);
		expect(input.getAttribute('capture')).toBe('user');
		expect(input.getAttribute('webkitdirectory')).toBe('');
		expect(accepted.container.querySelector('[data-part="clear-trigger"]')!.hasAttribute('hidden')).toBe(
			true
		);

		const locked = render(Phase6FileUpload, { props: { disabled: true, readOnly: true } });
		const lockedDropzone = locked.container.querySelector<HTMLElement>('[data-part="dropzone"]')!;
		expect(lockedDropzone.hasAttribute('data-disabled')).toBe(true);
		expect(lockedDropzone.hasAttribute('data-readonly')).toBe(true);
		expect(lockedDropzone.hasAttribute('tabindex')).toBe(false);
		expect(lockedDropzone.getAttribute('aria-disabled')).toBe('true');
		expect(
			locked.container.querySelector('[data-part="item-delete-trigger"]')
		).toBeNull();
	});

	test('accepts files and reports rejections with file error codes', async () => {
		const onFileAccept = vi.fn();
		const onFileReject = vi.fn();
		render(Phase6FileUpload, {
			props: {
				accept: '.png',
				maxFiles: 5,
				maxFileSize: 32,
				onFileAccept,
				onFileReject,
				testFiles: [
					makeFile('ok.png', 'image/png', 16),
					makeFile('blocked.txt', 'text/plain', 16),
					makeFile('huge.png', 'image/png', 64)
				]
			}
		});

		await fireEvent.click($('[data-testid="set-files"]')!);

		expect(onFileAccept).toHaveBeenCalledWith({ files: [expect.any(File)] });
		expect(onFileReject).toHaveBeenCalledWith({
			files: [
				{ file: expect.any(File), errors: ['FILE_INVALID_TYPE'] },
				{ file: expect.any(File), errors: ['FILE_TOO_LARGE'] }
			]
		});
		expect(itemNames()).toEqual(['ok.png']);
		expect($('[data-testid="remaining"]')!.textContent).toBe('4');
	});

	test('rejects a multi-file selection past maxFiles with TOO_MANY_FILES', async () => {
		const onFileReject = vi.fn();
		render(Phase6FileUpload, {
			props: {
				maxFiles: 1,
				showRejected: true,
				onFileReject,
				testFiles: [makeFile('a.txt', 'text/plain'), makeFile('b.txt', 'text/plain')]
			}
		});

		await fireEvent.click($('[data-testid="set-files"]')!);

		expect(itemNames()).toEqual(['a.txt', 'b.txt']);
		expect($('[data-testid="accepted-count"]')!.textContent).toBe('0');
		expect($('[data-testid="rejected-count"]')!.textContent).toBe('2');
		expect(onFileReject).toHaveBeenCalledWith({
			files: [
				{ file: expect.any(File), errors: ['TOO_MANY_FILES'] },
				{ file: expect.any(File), errors: ['TOO_MANY_FILES'] }
			]
		});
		expect($$('[data-part="item"][data-type="rejected"]')).toHaveLength(2);
		expect($('[data-part="item"][data-type="rejected"]')!.hasAttribute('data-accepted')).toBe(
			false
		);
	});

	test('tracks drag-over state on the dropzone and accepts a drop', async () => {
		render(Phase6FileUpload, { props: { maxFiles: 2 } });

		const files = [makeFile('drop.txt', 'text/plain')];
		await fireEvent.dragOver(dropzone(), { dataTransfer: dataTransferFor(files) });

		expect(dropzone().hasAttribute('data-dragging')).toBe(true);
		expect(dropzone().getAttribute('data-state')).toBe('dragging');
		expect(root().hasAttribute('data-dragging')).toBe(true);
		expect($('[data-testid="dragging"]')!.textContent).toBe('true');

		await fireEvent.drop(dropzone(), { dataTransfer: dataTransferFor(files) });
		await waitFor(() => expect(itemNames()).toEqual(['drop.txt']));

		expect(dropzone().hasAttribute('data-dragging')).toBe(false);
		expect($('[data-testid="dragging"]')!.textContent).toBe('false');
	});

	test('deletes an item through the item delete trigger and the api', async () => {
		const onFileAccept = vi.fn();
		render(Phase6FileUpload, {
			props: { maxFiles: 3, onFileAccept, testFiles: [makeFile('one.txt', 'text/plain')] }
		});

		await fireEvent.click($('[data-testid="set-files"]')!);
		expect(itemNames()).toEqual(['one.txt']);

		await fireEvent.click($('[data-part="item-delete-trigger"]')!);
		expect(itemNames()).toEqual([]);
		expect(onFileAccept).toHaveBeenLastCalledWith({ files: [] });
		expect($('[data-testid="accepted-count"]')!.textContent).toBe('0');
	});

	test('clears through the clear trigger and opens the picker from the api and trigger', async () => {
		const click = vi.spyOn(HTMLInputElement.prototype, 'click');
		render(Phase6FileUpload, {
			props: { maxFiles: 3, testFiles: [makeFile('one.txt', 'text/plain')] }
		});

		await fireEvent.click($('[data-testid="set-files"]')!);

		await fireEvent.click($('[data-part="clear-trigger"]')!);
		await waitFor(() => expect(itemNames()).toEqual([]));
		expect($('[data-part="clear-trigger"]')!.hidden).toBe(true);

		await fireEvent.click($('[data-testid="open-picker"]')!);
		await waitFor(() => expect(click).toHaveBeenCalled());

		click.mockClear();
		await fireEvent.click($('[data-part="trigger"]')!);
		await waitFor(() => expect(click).toHaveBeenCalled());
	});

	test('renders an image preview through the object url', async () => {
		const createObjectURL = vi.fn(() => 'blob:preview');
		const revokeObjectURL = vi.fn();
		const originalCreate = URL.createObjectURL;
		URL.createObjectURL = createObjectURL;
		URL.revokeObjectURL = revokeObjectURL;

		render(Phase6FileUpload, {
			props: { maxFiles: 2, testFiles: [makeFile('photo.png', 'image/png')] }
		});
		await fireEvent.click($('[data-testid="set-files"]')!);

		const image = $<HTMLImageElement>('[data-part="item-preview-image"]');
		expect(image?.getAttribute('src')).toBe('blob:preview');
		expect(image?.getAttribute('alt')).toBe('preview of photo.png');
		expect(image?.getAttribute('data-slot')).toBe('file-upload-item-preview-image');
		expect(createObjectURL).toHaveBeenCalled();

		URL.createObjectURL = originalCreate;
		URL.revokeObjectURL = revokeObjectURL as unknown as typeof URL.revokeObjectURL;
	});
});
