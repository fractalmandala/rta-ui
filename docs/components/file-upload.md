---
title: FileUpload
component: file-upload
description: Pick or drop files with type, size, and count checks.
---

# FileUpload

Pick or drop files with type, size, and count checks.

Port of `moduix/packages/svelte/src/components/file-upload` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Parts

| export | file |
| --- | --- |
| `FileUpload` | `FileUpload.svelte` |
| `FileUploadClearTrigger` | `FileUploadClearTrigger.svelte` |
| `FileUploadContext` | `FileUploadContext.svelte` |
| `FileUploadDropzone` | `FileUploadDropzone.svelte` |
| `FileUploadDropzoneIcon` | `FileUploadDropzoneIcon.svelte` |
| `FileUploadHiddenInput` | `FileUploadHiddenInput.svelte` |
| `FileUploadItem` | `FileUploadItem.svelte` |
| `FileUploadItemDeleteTrigger` | `FileUploadItemDeleteTrigger.svelte` |
| `FileUploadItemGroup` | `FileUploadItemGroup.svelte` |
| `FileUploadItemMetadata` | `FileUploadItemMetadata.svelte` |
| `FileUploadItemName` | `FileUploadItemName.svelte` |
| `FileUploadItemPreview` | `FileUploadItemPreview.svelte` |
| `FileUploadItemPreviewIcon` | `FileUploadItemPreviewIcon.svelte` |
| `FileUploadItemPreviewImage` | `FileUploadItemPreviewImage.svelte` |
| `FileUploadItemSizeText` | `FileUploadItemSizeText.svelte` |
| `FileUploadItems` | `FileUploadItems.svelte` |
| `FileUploadLabel` | `FileUploadLabel.svelte` |
| `FileUploadRootProvider` | `FileUploadRootProvider.svelte` |
| `FileUploadTrigger` | `FileUploadTrigger.svelte` |

`FileUploadContext` renders no element of its own: it creates the state and provides it to the other parts.

## Props

### `FileUpload` — `FileUploadRootProps`
accepts the native props of `HTMLProps<'div'>`, and adds to `FileUploadRootBaseProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string \| null` | — | from `UseFileUploadProps` |
| `ids` | `FileUploadElementIds` | — | from `UseFileUploadProps` |
| `name` | `string` | — | from `UseFileUploadProps` |
| `accept` | `FileAccept` | — | from `UseFileUploadProps` |
| `disabled` | `boolean` | — | from `UseFileUploadProps` |
| `required` | `boolean` | — | from `UseFileUploadProps` |
| `invalid` | `boolean` | — | from `UseFileUploadProps` |
| `readOnly` | `boolean` | — | from `UseFileUploadProps` |
| `allowDrop` | `boolean` | — | from `UseFileUploadProps` |
| `maxFileSize` | `number` | — | from `UseFileUploadProps` |
| `minFileSize` | `number` | — | from `UseFileUploadProps` |
| `maxFiles` | `number` | — | from `UseFileUploadProps` |
| `preventDocumentDrop` | `boolean` | — | from `UseFileUploadProps` |
| `capture` | `'user' \| 'environment'` | — | from `UseFileUploadProps` |
| `directory` | `boolean` | — | from `UseFileUploadProps` |
| `locale` | `string` | — | from `UseFileUploadProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseFileUploadProps` |
| `translations` | `FileUploadTranslations` | — | from `UseFileUploadProps` |
| `validate` | `(file: File, details: FileUploadFileValidateDetails) => FileUploadFileError[] \| null` | — | from `UseFileUploadProps` |
| `transformFiles` | `(files: File[]) => Promise<File[]>` | — | from `UseFileUploadProps` |
| `defaultAcceptedFiles` | `File[]` | — | from `UseFileUploadProps` |
| `acceptedFiles` | `File[]` | — | bindable from `UseFileUploadProps` |
| `onFileAccept` | `(details: FileUploadFileAcceptDetails) => void` | — | from `UseFileUploadProps` |
| `onFileChange` | `(details: FileUploadFileChangeDetails) => void` | — | from `UseFileUploadProps` |
| `onFileReject` | `(details: FileUploadFileRejectDetails) => void` | — | from `UseFileUploadProps` |

### `FileUploadContext` — `FileUploadContextProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `render` | `Snippet<[FileUploadApi]>` | — |  |

### `FileUploadDropzone` — `FileUploadDropzoneProps`
accepts the native props of `HTMLProps<'div'>`, and adds to `FileUploadDropzoneBaseProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `disableClick` | `boolean` | — | from `FileUploadDropzoneOptions` |

### `FileUploadItem` — `FileUploadItemProps`
accepts the native props of `HTMLProps<'li'>`, and adds to `FileUploadItemBaseProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `file` | `File` | — | from `FileUploadItemOptions` |
| `type` | `FileUploadItemType` | — | from `FileUploadItemOptions` |

### `FileUploadItemGroup` — `FileUploadItemGroupProps`
accepts the native props of `HTMLProps<'ul'>`, and adds to `FileUploadItemGroupBaseProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `type` | `FileUploadItemType` | — | from `FileUploadItemGroupOptions` |

### `FileUploadItemMetadata` — `FileUploadItemMetadataProps`
accepts the native props of `HTMLProps<'div'>`, `PolymorphicProps<'div'>`, `RefAttribute`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `file` | `File` | — |  |

### `FileUploadItemPreview` — `FileUploadItemPreviewProps`
accepts the native props of `HTMLProps<'div'>`, and adds to `FileUploadItemPreviewBaseProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `type` | `string` | — | Only render the preview for files whose MIME type matches this pattern. from `FileUploadItemPreviewBaseProps` |

### `FileUploadRootProvider` — `FileUploadRootProviderProps`
accepts the native props of `HTMLProps<'div'>`, and adds to `FileUploadRootProviderBaseProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `value` | `FileUploadApi` | — | from `FileUploadRootProviderBaseProps` |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `FileUpload` | `file-upload` | `root` | `file-upload-root` |
| `FileUploadClearTrigger` | `file-upload` | `clear-trigger` | `file-upload-clear-trigger` |
| `FileUploadDropzone` | `file-upload` | `dropzone` | `file-upload-dropzone` |
| `FileUploadDropzoneIcon` | `file-upload` | `dropzone-icon` | `file-upload-dropzone-icon` |
| `FileUploadItem` | `file-upload` | `item` | `file-upload-item` |
| `FileUploadItemDeleteTrigger` | `file-upload` | `item-delete-trigger` | `file-upload-item-delete-trigger` |
| `FileUploadItemGroup` | `file-upload` | `item-group` | `file-upload-item-group` |
| `FileUploadItemMetadata` | `file-upload` | `item-metadata` | `file-upload-item-metadata` |
| `FileUploadItemName` | `file-upload` | `item-name` | `file-upload-item-name` |
| `FileUploadItemPreview` | `file-upload` | `item-preview` | `file-upload-item-preview` |
| `FileUploadItemPreviewIcon` | `file-upload` | `item-preview-icon` | `file-upload-item-preview-icon` |
| `FileUploadItemPreviewImage` | `file-upload` | `item-preview-image` | `file-upload-item-preview-image` |
| `FileUploadItemSizeText` | `file-upload` | `item-size-text` | `file-upload-item-size-text` |
| `FileUploadLabel` | `file-upload` | `label` | `file-upload-label` |
| `FileUploadRootProvider` | `file-upload` | `root` | `file-upload-root-provider` |
| `FileUploadTrigger` | `file-upload` | `trigger` | `file-upload-trigger` |

## Generated ids

- `file:${id}`
- `file:${id}:dropzone`
- `file:${id}:input`
- `file:${id}:item-delete:${id}`
- `file:${id}:item-name:${id}`
- `file:${id}:item-preview:${id}`
- `file:${id}:item-size:${id}`
- `file:${id}:item:${id}`
- `file:${id}:label`
- `file:${id}:trigger`

Every id is overridable through the `ids` prop.

## Usage

The gallery demo, verbatim:

```svelte
<script lang="ts">
	import {
		FileUpload,
		FileUploadClearTrigger,
		FileUploadDropzone,
		FileUploadDropzoneIcon,
		FileUploadHiddenInput,
		FileUploadItems,
		FileUploadLabel,
		FileUploadTrigger
	} from 'rta-ui';
</script>

<div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: start">
	<FileUpload accept="image/*,.pdf" maxFiles={3} maxFileSize={5_000_000}>
		<FileUploadLabel>Attachments</FileUploadLabel>
		<FileUploadDropzone>
			<FileUploadDropzoneIcon />
			<span>Drop files here or browse</span>
			<FileUploadTrigger>Browse files</FileUploadTrigger>
		</FileUploadDropzone>
		<FileUploadHiddenInput />
		<FileUploadItems />
		<FileUploadClearTrigger>Clear all</FileUploadClearTrigger>
	</FileUpload>

	<FileUpload accept="image/*" maxFiles={1} style="max-width: 16rem">
		<FileUploadLabel>Avatar</FileUploadLabel>
		<FileUploadDropzone>
			<FileUploadDropzoneIcon />
			<span>Drop one image</span>
		</FileUploadDropzone>
		<FileUploadHiddenInput />
		<FileUploadItems />
	</FileUpload>
</div>
```

## Behaviour covered by tests

- renders every anatomy part with scope, part and slot hooks
- writes accept, multiple, capture and directory onto the hidden input
- accepts files and reports rejections with file error codes
- rejects a multi-file selection past maxFiles with TOO_MANY_FILES
- tracks drag-over state on the dropzone and accepts a drop
- deletes an item through the item delete trigger and the api
- clears through the clear trigger and opens the picker from the api and trigger
- renders an image preview through the object url

## Notes

- **Parity:** `data-slot` hooks match moduix exactly (`pnpm parity`).

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
