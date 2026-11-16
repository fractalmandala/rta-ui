<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { SplitterApi } from '../splitter/splitter.state.svelte';
	import type { SidebarApi } from './sidebar.state.svelte';

	export interface SidebarRootProviderProps {
		value: SidebarApi;
		/** Splitter api behind the panels, when the consumer created its own. */
		splitter?: SplitterApi;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { setSplitterContext } from '../splitter/splitter.state.svelte';
	import { setSidebarContext } from './sidebar.state.svelte';

	let { children, splitter, value }: SidebarRootProviderProps = $props();

	const sidebarApi = untrack(() => value);
	const splitterApi = untrack(() => splitter);
	setSidebarContext(sidebarApi);
	if (splitterApi) setSplitterContext(splitterApi);
</script>

{@render children?.()}
