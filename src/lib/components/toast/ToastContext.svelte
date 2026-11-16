<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { ToastApi } from './toast.state.svelte';

	export interface ToastContextProps {
		render: Snippet<[ToastApi]>;
	}
</script>

<script lang="ts">
	import { useToastContext } from './toast.state.svelte';

	let { render }: ToastContextProps = $props();

	const toast = useToastContext();
</script>

{@render render(toast)}
