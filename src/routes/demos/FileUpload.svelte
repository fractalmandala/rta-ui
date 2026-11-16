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
	} from '../../lib/index';
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
