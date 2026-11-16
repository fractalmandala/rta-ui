import { createContext } from '../../internal/context';
import { dataAttr, visuallyHiddenStyle } from '../../internal/dom';
import {
	createFileTypeValidator,
	formatBytes,
	getAcceptAttrString,
	getFileEntries,
	getFileKey,
	isFileEqual,
	isValidFileSize,
	type FileAccept,
	type FileError
} from './file-utils';

export type FileUploadFileError = FileError;
export type FileUploadFileMimeType = string;
export type FileUploadItemType = 'accepted' | 'rejected';

export type {
	FileAccept as FileUploadAccept,
	FileError as FileUploadFileErrorCode
} from './file-utils';

export interface FileUploadFileRejection {
	file: File;
	errors: FileUploadFileError[];
}

export interface FileUploadFileChangeDetails {
	acceptedFiles: File[];
	rejectedFiles: FileUploadFileRejection[];
}

export interface FileUploadFileValidateDetails {
	acceptedFiles: File[];
	rejectedFiles: FileUploadFileRejection[];
}

export interface FileUploadFileAcceptDetails {
	files: File[];
}

export interface FileUploadFileRejectDetails {
	files: FileUploadFileRejection[];
}

export interface FileUploadElementIds {
	root?: string;
	dropzone?: string;
	hiddenInput?: string;
	trigger?: string;
	label?: string;
	item?: (id: string) => string;
	itemName?: (id: string) => string;
	itemSizeText?: (id: string) => string;
	itemPreview?: (id: string) => string;
	itemDeleteTrigger?: (id: string) => string;
}

export interface FileUploadTranslations {
	dropzone?: string;
	itemPreview?: (file: File) => string;
	deleteFile?: (file: File) => string;
}

export interface FileUploadDropzoneOptions {
	disableClick?: boolean;
}

export interface FileUploadItemOptions {
	file: File;
	type?: FileUploadItemType;
}

export interface FileUploadItemGroupOptions {
	type?: FileUploadItemType;
}

export interface FileUploadItemPreviewImageOptions extends FileUploadItemOptions {
	url: string;
}

export interface UseFileUploadProps {
	id?: string | null;
	ids?: FileUploadElementIds;
	name?: string;
	accept?: FileAccept;
	disabled?: boolean;
	required?: boolean;
	invalid?: boolean;
	readOnly?: boolean;
	allowDrop?: boolean;
	maxFileSize?: number;
	minFileSize?: number;
	maxFiles?: number;
	preventDocumentDrop?: boolean;
	capture?: 'user' | 'environment';
	directory?: boolean;
	locale?: string;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	translations?: FileUploadTranslations;
	validate?: (file: File, details: FileUploadFileValidateDetails) => FileUploadFileError[] | null;
	transformFiles?: (files: File[]) => Promise<File[]>;
	defaultAcceptedFiles?: File[];
	acceptedFiles?: File[];
	onFileAccept?: (details: FileUploadFileAcceptDetails) => void;
	onFileChange?: (details: FileUploadFileChangeDetails) => void;
	onFileReject?: (details: FileUploadFileRejectDetails) => void;
}

type Attrs = Record<string, unknown>;

export interface FileUploadApi {
	readonly dragging: boolean;
	readonly focused: boolean;
	readonly disabled: boolean;
	readonly readOnly: boolean;
	readonly transforming: boolean;
	readonly maxFilesReached: boolean;
	readonly remainingFiles: number;
	readonly acceptedFiles: File[];
	readonly rejectedFiles: FileUploadFileRejection[];
	openFilePicker(): void;
	deleteFile(file: File, type?: FileUploadItemType): void;
	setFiles(files: File[]): void;
	clearFiles(): void;
	clearRejectedFiles(): void;
	getFileSize(file: File): string;
	createFileUrl(file: File, callback: (url: string) => void): () => void;
	setClipboardFiles(dataTransfer: DataTransfer | null): boolean;
	rootAttrs(): Attrs;
	dropzoneAttrs(options?: FileUploadDropzoneOptions): Attrs;
	triggerAttrs(): Attrs;
	hiddenInputAttrs(): Attrs;
	labelAttrs(): Attrs;
	clearTriggerAttrs(): Attrs;
	itemGroupAttrs(options?: FileUploadItemGroupOptions): Attrs;
	itemAttrs(options: FileUploadItemOptions): Attrs;
	itemNameAttrs(options: FileUploadItemOptions): Attrs;
	itemSizeTextAttrs(options: FileUploadItemOptions): Attrs;
	itemPreviewAttrs(options: FileUploadItemOptions): Attrs;
	itemPreviewImageAttrs(options: FileUploadItemPreviewImageOptions): Attrs;
	itemDeleteTriggerAttrs(options: FileUploadItemOptions): Attrs;
	registerRoot(node: Element | null): void;
	registerDropzone(node: Element | null): void;
	registerHiddenInput(node: HTMLInputElement | null): void;
}

export type UseFileUploadReturn = FileUploadApi;
export type UseFileUploadContext = FileUploadApi;

const defaultTranslations = {
	dropzone: 'dropzone',
	itemPreview: (file: File) => `preview of ${file.name}`,
	deleteFile: (file: File) => `delete file ${file.name}`
};

const DEFAULT_ITEM_TYPE: FileUploadItemType = 'accepted';
const INTERACTIVE_SELECTOR =
	"button, a[href], input:not([type='file']), select, textarea, [tabindex], [contenteditable]";

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	const result: Record<string, unknown> = {};
	for (const [key, entry] of Object.entries(value)) {
		if (entry !== undefined) result[key] = entry;
	}
	return result as T;
}

function contains(parent: Element | null | undefined, child: Node | null | undefined): boolean {
	return !!parent && !!child && parent.contains(child);
}

function isEventWithFiles(event: DragEvent): boolean {
	const target = event.target as (EventTarget & { files?: unknown }) | null;
	if (!event.dataTransfer) return !!target && 'files' in target;
	return Array.from(event.dataTransfer.types ?? []).some(
		(type) => type === 'Files' || type === 'application/x-moz-file'
	);
}

function isInteractiveTarget(element: Element | null, container: Element) {
	if (!element || element.getAttribute('type') === 'file') return false;
	const interactive = element.closest(INTERACTIVE_SELECTOR);
	return interactive !== container && contains(container, interactive);
}

function hash(value: string): string {
	let result = 0;
	for (let index = 0; index < value.length; index++) {
		const char = value.charCodeAt(index);
		result = (result << 5) - result + char;
		result |= 0;
	}
	return Math.abs(result).toString(36);
}

const getFileId = (file: File) => hash(`${file.name}-${file.size}`);

function setInputFiles(input: HTMLInputElement, files: File[]) {
	const win = input.ownerDocument.defaultView;
	if (!win || !('DataTransfer' in win)) return;
	try {
		const dataTransfer = new win.DataTransfer();
		files.forEach((file) => dataTransfer.items.add(file));
		input.files = dataTransfer.files;
	} catch {
		// A read-only or unavailable `files` list leaves the native input untouched.
	}
}

const fileUploadContext = createContext<FileUploadApi>('FileUpload', 'FileUpload');
const fileUploadItemContext =
	createContext<() => FileUploadItemOptions>('FileUploadItem', 'FileUpload.Item');
const fileUploadItemGroupContext =
	createContext<() => FileUploadItemGroupOptions>('FileUploadItemGroup', 'FileUpload.ItemGroup');

export const setFileUploadContext = (api: FileUploadApi): FileUploadApi =>
	fileUploadContext.set(api);
export const useFileUploadContext = (): FileUploadApi => fileUploadContext.get();
export const setFileUploadItemContext = (
	options: () => FileUploadItemOptions
): (() => FileUploadItemOptions) => fileUploadItemContext.set(options);
export const useFileUploadItemContext = (): (() => FileUploadItemOptions) =>
	fileUploadItemContext.get();
export const setFileUploadItemGroupContext = (
	options: () => FileUploadItemGroupOptions
): (() => FileUploadItemGroupOptions) => fileUploadItemGroupContext.set(options);
export const useFileUploadItemGroupContext = (): (() => FileUploadItemGroupOptions) =>
	fileUploadItemGroupContext.use() ?? (() => ({}));

export function createFileUpload(props: () => UseFileUploadProps, uid: string): FileUploadApi {
	const prop = <K extends keyof UseFileUploadProps>(key: K): UseFileUploadProps[K] =>
		props()[key];

	const disabled = () => Boolean(prop('disabled'));
	const readOnly = () => Boolean(prop('readOnly'));
	const required = () => Boolean(prop('required'));
	const interactive = () => !disabled() && !readOnly();
	const allowDrop = () => prop('allowDrop') !== false;
	const maxFiles = () => prop('maxFiles') ?? 1;
	const minFileSize = () => prop('minFileSize') ?? 0;
	const maxFileSize = () => prop('maxFileSize') ?? Number.POSITIVE_INFINITY;
	const multiple = () => maxFiles() > 1;
	const acceptAttr = () => getAcceptAttrString(prop('accept'));
	const translations = () => ({ ...defaultTranslations, ...prop('translations') });

	const base = () => prop('id') ?? uid;
	const rootId = () => prop('ids')?.root ?? `file:${base()}`;
	const dropzoneId = () => prop('ids')?.dropzone ?? `file:${base()}:dropzone`;
	const hiddenInputId = () => prop('ids')?.hiddenInput ?? `file:${base()}:input`;
	const triggerId = () => prop('ids')?.trigger ?? `file:${base()}:trigger`;
	const labelId = () => prop('ids')?.label ?? `file:${base()}:label`;
	const itemId = (id: string) => prop('ids')?.item?.(id) ?? `file:${base()}:item:${id}`;
	const itemNameId = (id: string) => prop('ids')?.itemName?.(id) ?? `file:${base()}:item-name:${id}`;
	const itemSizeTextId = (id: string) =>
		prop('ids')?.itemSizeText?.(id) ?? `file:${base()}:item-size:${id}`;
	const itemPreviewId = (id: string) =>
		prop('ids')?.itemPreview?.(id) ?? `file:${base()}:item-preview:${id}`;
	const itemDeleteTriggerId = (id: string) =>
		prop('ids')?.itemDeleteTrigger?.(id) ?? `file:${base()}:item-delete:${id}`;

	let internalAcceptedFiles = $state<File[]>(prop('defaultAcceptedFiles') ?? []);
	let internalRejectedFiles = $state<FileUploadFileRejection[]>([]);
	let phase = $state<'idle' | 'focused' | 'dragging'>('idle');
	let transforming = $state(false);

	let rootNode = $state<Element | null>(null);
	let dropzoneNode: Element | null = null;
	let hiddenInputNode: HTMLInputElement | null = null;

	const acceptedFiles = () => prop('acceptedFiles') ?? internalAcceptedFiles;
	const rejectedFiles = () => internalRejectedFiles;
	const dragging = () => phase === 'dragging';
	const focused = () => phase === 'focused';
	const maxFilesReached = () => acceptedFiles().length >= maxFiles();
	const remainingFiles = () => Math.max(0, maxFiles() - acceptedFiles().length);

	function setAcceptedFiles(next: File[]) {
		const previous = acceptedFiles();
		if (
			previous.length === next.length &&
			previous.every((file, index) => isFileEqual(file, next[index]))
		) {
			return;
		}
		if (prop('acceptedFiles') === undefined) internalAcceptedFiles = next;
		prop('onFileAccept')?.({ files: next });
		prop('onFileChange')?.({ acceptedFiles: next, rejectedFiles: rejectedFiles() });
	}

	function setRejectedFiles(next: FileUploadFileRejection[]) {
		const previous = rejectedFiles();
		if (
			previous.length === next.length &&
			previous.every((entry, index) => isFileEqual(entry.file, next[index].file))
		) {
			return;
		}
		internalRejectedFiles = next;
		prop('onFileReject')?.({ files: next });
		prop('onFileChange')?.({ acceptedFiles: acceptedFiles(), rejectedFiles: next });
	}

	function isFilesWithinRange(incomingCount: number, currentCount: number) {
		if (!multiple() && incomingCount > 1) return false;
		if (!multiple() && incomingCount + currentCount === 2) return true;
		if (incomingCount + currentCount > maxFiles()) return false;
		return true;
	}

	function getEventFiles(
		files: File[],
		currentAcceptedFiles: File[] = [],
		currentRejectedFiles: FileUploadFileRejection[] = []
	) {
		const accepted: File[] = [];
		const rejected: FileUploadFileRejection[] = [];
		const validateParams = {
			acceptedFiles: currentAcceptedFiles,
			rejectedFiles: currentRejectedFiles
		};
		const acceptedKeys = new Set(currentAcceptedFiles.map(getFileKey));
		const isValidFileType = createFileTypeValidator(acceptAttr());
		const validate = prop('validate');

		files.forEach((file) => {
			const [acceptedFile, acceptError] = isValidFileType(file);
			const [sizeMatch, sizeError] = isValidFileSize(file, minFileSize(), maxFileSize());
			const fileKey = getFileKey(file);
			const isDuplicate = acceptedKeys.has(fileKey);
			const validateErrors = validate?.(file, validateParams);
			const valid = validateErrors ? validateErrors.length === 0 : true;

			if (acceptedFile && sizeMatch && valid && !isDuplicate) {
				accepted.push(file);
				acceptedKeys.add(fileKey);
				return;
			}

			const errors: FileUploadFileError[] = [];
			if (acceptError) errors.push(acceptError);
			if (sizeError) errors.push(sizeError);
			if (isDuplicate) errors.push('FILE_EXISTS');
			if (!valid) errors.push(...(validateErrors ?? []));
			rejected.push({ file, errors });
		});

		if (!isFilesWithinRange(accepted.length, currentAcceptedFiles.length)) {
			accepted.forEach((file) => rejected.push({ file, errors: ['TOO_MANY_FILES'] }));
			accepted.splice(0);
		}

		return { acceptedFiles: accepted, rejectedFiles: rejected };
	}

	function setFiles(files: File[]) {
		if (!interactive()) return;
		const { acceptedFiles: accepted, rejectedFiles: rejected } = getEventFiles(files);
		setAcceptedFiles(multiple() ? accepted : accepted.length > 0 ? [accepted[0]] : []);
		setRejectedFiles(rejected);
	}

	function setEventFiles(files: File[]) {
		const currentAccepted = acceptedFiles();
		const currentRejected = rejectedFiles();
		const { acceptedFiles: accepted, rejectedFiles: rejected } = getEventFiles(
			files,
			currentAccepted,
			currentRejected
		);

		const commit = (incoming: File[]) => {
			if (multiple()) {
				setAcceptedFiles([...acceptedFiles(), ...incoming]);
				setRejectedFiles(rejected);
				return;
			}
			if (incoming.length) {
				setAcceptedFiles([incoming[0]]);
				setRejectedFiles(rejected);
				return;
			}
			if (rejected.length) setRejectedFiles(rejected);
		};

		const transform = prop('transformFiles');
		if (!transform) {
			commit(accepted);
			return;
		}

		transforming = true;
		transform(accepted)
			.then(commit)
			.catch(() => undefined)
			.finally(() => {
				transforming = false;
			});
	}

	function deleteFile(file: File, type: FileUploadItemType = DEFAULT_ITEM_TYPE) {
		if (!interactive()) return;
		if (type === 'rejected') {
			setRejectedFiles(rejectedFiles().filter((entry) => !isFileEqual(entry.file, file)));
			return;
		}
		setAcceptedFiles(acceptedFiles().filter((entry) => !isFileEqual(entry, file)));
	}

	function openFilePicker() {
		if (!interactive()) return;
		queueMicrotask(() => {
			const input = hiddenInputNode ?? resolveHiddenInput();
			input?.click();
		});
	}

	function clearFiles() {
		if (!interactive()) return;
		setAcceptedFiles([]);
		setRejectedFiles([]);
	}

	function clearRejectedFiles() {
		if (!interactive()) return;
		setRejectedFiles([]);
	}

	function getFileSize(file: File) {
		return formatBytes(file.size, prop('locale'));
	}

	function documentOf(): Document {
		return rootNode?.ownerDocument ?? globalThis.document;
	}

	function resolveHiddenInput(): HTMLInputElement | null {
		const node = documentOf().getElementById(hiddenInputId());
		return node && node.localName === 'input' ? (node as HTMLInputElement) : null;
	}

	function createFileUrl(file: File, callback: (url: string) => void) {
		const win = documentOf().defaultView;
		const create = win?.URL?.createObjectURL?.bind(win.URL);
		if (!create) {
			callback('');
			return () => undefined;
		}
		const url = create(file);
		callback(url);
		return () => win?.URL?.revokeObjectURL?.(url);
	}

	function setClipboardFiles(dataTransfer: DataTransfer | null) {
		if (!interactive()) return false;
		const files: File[] = [];
		for (const item of Array.from(dataTransfer?.items ?? [])) {
			if (item.kind !== 'file') continue;
			const file = item.getAsFile();
			if (file) files.push(file);
		}
		if (!files.length) return false;
		setEventFiles(files);
		return true;
	}

	function itemContextFor(options: FileUploadItemOptions) {
		const type = options.type ?? DEFAULT_ITEM_TYPE;
		const fileId = getFileId(options.file);
		return { fileId, type };
	}

	$effect(() => {
		if (!prop('preventDocumentDrop') || !allowDrop() || disabled()) return;
		const doc = documentOf();
		const root = rootNode;
		const onDragOver = (event: DragEvent) => event.preventDefault();
		const onDrop = (event: DragEvent) => {
			if (root && contains(root, event.target as Node | null)) return;
			event.preventDefault();
		};
		doc.addEventListener('dragover', onDragOver);
		doc.addEventListener('drop', onDrop);
		return () => {
			doc.removeEventListener('dragover', onDragOver);
			doc.removeEventListener('drop', onDrop);
		};
	});

	$effect(() => {
		const files = acceptedFiles();
		queueMicrotask(() => {
			const input = hiddenInputNode ?? resolveHiddenInput();
			if (!input) return;
			setInputFiles(input, files);
			const win = input.ownerDocument.defaultView;
			input.dispatchEvent(new (win?.Event ?? Event)('change', { bubbles: true }));
		});
	});

	return {
		get dragging() {
			return dragging();
		},
		get focused() {
			return focused();
		},
		get disabled() {
			return disabled();
		},
		get readOnly() {
			return readOnly();
		},
		get transforming() {
			return transforming;
		},
		get maxFilesReached() {
			return maxFilesReached();
		},
		get remainingFiles() {
			return remainingFiles();
		},
		get acceptedFiles() {
			return acceptedFiles();
		},
		get rejectedFiles() {
			return rejectedFiles();
		},
		openFilePicker,
		deleteFile,
		setFiles,
		clearFiles,
		clearRejectedFiles,
		getFileSize,
		createFileUrl,
		setClipboardFiles,
		rootAttrs: () =>
			dropUndefined({
				id: rootId(),
				dir: prop('dir') ?? undefined,
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				'data-dragging': dataAttr(dragging()),
				'data-state': phase
			}),
		dropzoneAttrs: (options = {}) =>
			dropUndefined({
				id: dropzoneId(),
				dir: prop('dir') ?? undefined,
				tabindex: disabled() || readOnly() || options.disableClick ? undefined : 0,
				role: options.disableClick ? 'application' : 'button',
				'aria-label': translations().dropzone,
				'aria-disabled': disabled() || readOnly() || undefined,
				'data-invalid': dataAttr(prop('invalid')),
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				'data-dragging': dataAttr(dragging()),
				'data-state': phase,
				onkeydown(event: KeyboardEvent) {
					if (!interactive()) return;
					if (event.defaultPrevented) return;
					const current = event.currentTarget as Element;
					const target = event.target as Element | null;
					if (!contains(current, target)) return;
					if (isInteractiveTarget(target, current)) return;
					if (options.disableClick) return;
					if (event.key !== 'Enter' && event.key !== ' ') return;
					event.preventDefault();
					openFilePicker();
				},
				onclick(event: MouseEvent) {
					if (!interactive()) return;
					if (event.defaultPrevented) return;
					if (options.disableClick) return;
					const current = event.currentTarget as Element;
					const target = event.target as Element | null;
					if (!contains(current, target)) return;
					if (isInteractiveTarget(target, current)) return;
					if (current.localName === 'label') event.preventDefault();
					openFilePicker();
				},
				ondragover(event: DragEvent) {
					if (!interactive()) return;
					if (!allowDrop()) return;
					event.preventDefault();
					event.stopPropagation();
					try {
						if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
					} catch {
						// A synthetic data transfer can reject `dropEffect`; dragging state still updates.
					}
					if (!isEventWithFiles(event)) return;
					phase = 'dragging';
				},
				ondragleave(event: DragEvent) {
					if (!interactive()) return;
					if (!allowDrop()) return;
					const current = event.currentTarget as Element;
					if (contains(current, event.relatedTarget as Node | null)) return;
					if (phase === 'dragging') phase = 'idle';
				},
				ondrop(event: DragEvent) {
					if (!interactive()) return;
					if (allowDrop()) {
						event.preventDefault();
						event.stopPropagation();
					}
					if (!isEventWithFiles(event)) return;
					void getFileEntries(event.dataTransfer?.items, prop('directory')).then((files) => {
						phase = 'idle';
						setEventFiles(files);
					});
				},
				onfocus() {
					if (!interactive()) return;
					phase = 'focused';
				},
				onblur() {
					if (!interactive()) return;
					if (phase === 'focused') phase = 'idle';
				}
			}),
		triggerAttrs: () =>
			dropUndefined({
				id: triggerId(),
				dir: prop('dir') ?? undefined,
				type: 'button',
				disabled: disabled() || readOnly(),
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				'data-invalid': dataAttr(prop('invalid')),
				onclick(event: MouseEvent) {
					if (!interactive()) return;
					if (dropzoneNode && contains(dropzoneNode, event.currentTarget as Node)) {
						event.stopPropagation();
					}
					openFilePicker();
				}
			}),
		hiddenInputAttrs: () =>
			dropUndefined({
				id: hiddenInputId(),
				type: 'file',
				tabindex: -1,
				disabled: disabled() || readOnly(),
				required: required(),
				capture: prop('capture'),
				name: prop('name'),
				accept: acceptAttr(),
				webkitdirectory: prop('directory') ? '' : undefined,
				multiple: multiple() || maxFiles() > 1,
				'aria-hidden': true,
				style: visuallyHiddenStyle,
				onclick(event: MouseEvent) {
					event.stopPropagation();
					(event.currentTarget as HTMLInputElement).value = '';
				},
				oninput(event: Event) {
					if (!interactive()) return;
					const input = event.currentTarget as HTMLInputElement;
					setEventFiles(input.files ? Array.from(input.files) : []);
				}
			}),
		labelAttrs: () =>
			dropUndefined({
				id: labelId(),
				dir: prop('dir') ?? undefined,
				for: hiddenInputId(),
				'data-disabled': dataAttr(disabled()),
				'data-invalid': dataAttr(prop('invalid')),
				'data-required': dataAttr(required())
			}),
		clearTriggerAttrs: () =>
			dropUndefined({
				dir: prop('dir') ?? undefined,
				type: 'button',
				disabled: disabled() || readOnly(),
				hidden: acceptedFiles().length === 0,
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					clearFiles();
				}
			}),
		itemGroupAttrs: (options = {}) =>
			dropUndefined({
				dir: prop('dir') ?? undefined,
				'data-disabled': dataAttr(disabled()),
				'data-type': options.type ?? DEFAULT_ITEM_TYPE
			}),
		itemAttrs: (options) => {
			const { fileId, type } = itemContextFor(options);
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				id: itemId(fileId),
				'data-disabled': dataAttr(disabled()),
				'data-type': type,
				'data-accepted': dataAttr(type === 'accepted'),
				'data-state': type
			});
		},
		itemNameAttrs: (options) => {
			const { fileId, type } = itemContextFor(options);
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				id: itemNameId(fileId),
				'data-disabled': dataAttr(disabled()),
				'data-type': type
			});
		},
		itemSizeTextAttrs: (options) => {
			const { fileId, type } = itemContextFor(options);
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				id: itemSizeTextId(fileId),
				'data-disabled': dataAttr(disabled()),
				'data-type': type
			});
		},
		itemPreviewAttrs: (options) => {
			const { fileId, type } = itemContextFor(options);
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				id: itemPreviewId(fileId),
				'data-disabled': dataAttr(disabled()),
				'data-type': type
			});
		},
		itemPreviewImageAttrs: (options) => {
			const { file, url, type = DEFAULT_ITEM_TYPE } = options;
			if (!file.type.startsWith('image/')) {
				throw new Error('Preview Image is only supported for image files');
			}
			return dropUndefined({
				src: url || undefined,
				alt: translations().itemPreview?.(file),
				'data-disabled': dataAttr(disabled()),
				'data-type': type
			});
		},
		itemDeleteTriggerAttrs: (options) => {
			const { file, type = DEFAULT_ITEM_TYPE } = options;
			const { fileId } = itemContextFor(options);
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				id: itemDeleteTriggerId(fileId),
				type: 'button',
				disabled: disabled() || readOnly(),
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				'data-type': type,
				'aria-label': translations().deleteFile?.(file),
				onclick() {
					deleteFile(file, type);
				}
			});
		},
		registerRoot: (node) => {
			rootNode = node;
		},
		registerDropzone: (node) => {
			dropzoneNode = node;
		},
		registerHiddenInput: (node) => {
			hiddenInputNode = node;
		}
	};
}
