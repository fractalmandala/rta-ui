<script module lang="ts">
	import type { Snippet } from 'svelte';
</script>

<script lang="ts">
	import {
		connectDrawerStack,
		createDrawerStack,
		provideDrawerStackStore,
		setDrawerStackContext
	} from './drawer.stack.svelte';

	let { children }: { children?: Snippet } = $props();

	const stack = createDrawerStack();
	provideDrawerStackStore(stack);

	let snapshot = $state(stack.getSnapshot());

	$effect(() => stack.subscribe(() => (snapshot = stack.getSnapshot())));

	setDrawerStackContext(connectDrawerStack(() => snapshot));
</script>

{@render children?.()}
