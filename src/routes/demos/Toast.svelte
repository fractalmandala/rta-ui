<script lang="ts">
	import { ToastToaster, createToaster } from '../../lib/components/toast/index';

	const toaster = createToaster({ placement: 'bottom-end', overlap: true, gap: 16, max: 4 });

	function upload() {
		const file = Promise.resolve('report.pdf');
		toaster.promise(file, {
			loading: { title: 'Uploading', description: 'Sending report.pdf' },
			success: { title: 'Uploaded', description: 'report.pdf is on the server.' },
			error: { title: 'Upload failed', description: 'Try again in a moment.' }
		});
	}
</script>

<div class="demo-row">
	<button
		type="button"
		onclick={() => toaster.info({ title: 'Saved', description: 'Your changes are stored.' })}>
		Info toast
	</button>
	<button
		type="button"
		onclick={() => toaster.success({ title: 'Workspace synced', description: 'Everyone has the new map.' })}>
		Success toast
	</button>
	<button
		type="button"
		onclick={() => toaster.error({ title: 'Upload failed', description: 'The file is larger than 10 MB.' })}>
		Error toast
	</button>
	<button
		type="button"
		onclick={() =>
			toaster.warning({ title: 'Storage almost full', description: '92% of the quota is used.' })}>
		Warning toast
	</button>
	<button type="button" onclick={upload}>Promise toast</button>
	<button
		type="button"
		onclick={() =>
			toaster.create({
				title: 'File deleted',
				description: 'The file left the workspace.',
				action: { label: 'Undo', onClick: () => toaster.success({ title: 'Restored' }) }
			})}>
		Action toast
	</button>
	<button type="button" onclick={() => toaster.dismiss()}>Dismiss all</button>
</div>

<ToastToaster {toaster} label="Notifications" />
