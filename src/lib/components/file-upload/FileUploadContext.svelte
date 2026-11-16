<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { FileUploadApi } from './file-upload.state.svelte';

	export interface FileUploadContextProps {
		render: Snippet<[FileUploadApi]>;
	}
</script>

<script lang="ts">
	import { useFileUploadContext } from './file-upload.state.svelte';

	const { render }: FileUploadContextProps = $props();

	const api = useFileUploadContext();
</script>

{@render render(api)}
