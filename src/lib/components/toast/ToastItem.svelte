<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { ToastRecord, ToastGroupApi } from './toast.state.svelte';

	export interface ToastItemProps {
		value: ToastRecord;
		index: number;
		group: ToastGroupApi;
		children?: Snippet<[() => ToastRecord]>;
	}
</script>

<script lang="ts">
	import { createToast, setToastContext } from './toast.state.svelte';

	let { value, index, group, children }: ToastItemProps = $props();

	const uid = $props.id();
	const api = createToast(() => ({ record: value, index, group }), uid);
	setToastContext(api);
</script>

{@render children?.(() => value)}
