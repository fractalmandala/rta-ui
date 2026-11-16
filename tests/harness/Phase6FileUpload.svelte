<script lang="ts">
	import {
		FileUpload,
		FileUploadClearTrigger,
		FileUploadContext,
		FileUploadDropzone,
		FileUploadDropzoneIcon,
		FileUploadHiddenInput,
		FileUploadItem,
		FileUploadItemDeleteTrigger,
		FileUploadItemGroup,
		FileUploadItemName,
		FileUploadItemPreview,
		FileUploadItemPreviewIcon,
		FileUploadItemPreviewImage,
		FileUploadItemSizeText,
		FileUploadLabel,
		FileUploadTrigger
	} from '../../src/lib/components/file-upload/index';
	import type {
		FileUploadAccept,
		FileUploadFileAcceptDetails,
		FileUploadFileChangeDetails,
		FileUploadFileRejectDetails
	} from '../../src/lib/components/file-upload/index';

	let {
		accept,
		allowDrop = true,
		capture,
		directory = false,
		disabled = false,
		readOnly = false,
		maxFiles = 1,
		maxFileSize,
		minFileSize,
		showRejected = false,
		testFiles = [],
		acceptedFiles = $bindable(),
		onFileAccept,
		onFileReject,
		onFileChange
	}: {
		accept?: FileUploadAccept;
		allowDrop?: boolean;
		capture?: 'user' | 'environment';
		directory?: boolean;
		disabled?: boolean;
		readOnly?: boolean;
		maxFiles?: number;
		maxFileSize?: number;
		minFileSize?: number;
		showRejected?: boolean;
		testFiles?: File[];
		acceptedFiles?: File[];
		onFileAccept?: (details: FileUploadFileAcceptDetails) => void;
		onFileReject?: (details: FileUploadFileRejectDetails) => void;
		onFileChange?: (details: FileUploadFileChangeDetails) => void;
	} = $props();
</script>

<FileUpload
	{accept}
	{allowDrop}
	{capture}
	{directory}
	{disabled}
	{readOnly}
	{maxFiles}
	{maxFileSize}
	{minFileSize}
	bind:acceptedFiles
	{onFileAccept}
	{onFileReject}
	{onFileChange}
>
	<FileUploadLabel>Attachments</FileUploadLabel>
	<FileUploadDropzone>
		<FileUploadDropzoneIcon />
		<span>Drop files here or browse</span>
		<FileUploadTrigger>Browse files</FileUploadTrigger>
	</FileUploadDropzone>
	<FileUploadHiddenInput />
	<FileUploadContext>
		{#snippet render(api)}
			<FileUploadItemGroup>
				{#each api.acceptedFiles as file (`${file.name}-${file.size}`)}
					<FileUploadItem {file}>
						<FileUploadItemPreview>
							{#if file.type.startsWith('image/')}
								<FileUploadItemPreviewImage />
							{:else}
								<FileUploadItemPreviewIcon />
							{/if}
						</FileUploadItemPreview>
						<FileUploadItemName />
						<FileUploadItemSizeText />
						<FileUploadItemDeleteTrigger />
					</FileUploadItem>
				{/each}
			</FileUploadItemGroup>
			{#if showRejected}
				<FileUploadItemGroup type="rejected">
					{#each api.rejectedFiles as rejection (rejection.file.name)}
						<FileUploadItem file={rejection.file}>
							<FileUploadItemName />
							<FileUploadItemDeleteTrigger />
						</FileUploadItem>
					{/each}
				</FileUploadItemGroup>
			{/if}
			<FileUploadClearTrigger>Clear all</FileUploadClearTrigger>
			<output data-testid="dragging">{api.dragging}</output>
			<output data-testid="remaining">{api.remainingFiles}</output>
			<output data-testid="accepted-count">{api.acceptedFiles.length}</output>
			<output data-testid="rejected-count">{api.rejectedFiles.length}</output>
			<button type="button" data-testid="set-files" onclick={() => api.setFiles(testFiles)}>
				Set files
			</button>
			<button type="button" data-testid="open-picker" onclick={() => api.openFilePicker()}>
				Open picker
			</button>
			<button
				type="button"
				data-testid="delete-first"
				onclick={() => api.acceptedFiles[0] && api.deleteFile(api.acceptedFiles[0])}
			>
				Delete first
			</button>
		{/snippet}
	</FileUploadContext>
</FileUpload>
