<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { MenuPortalOptions } from './menu.portal.svelte';
	import type { MenuApi } from './menu.state.svelte';

	export interface MenuRootProviderProps extends MenuPortalOptions {
		value: MenuApi;
		portalRef?: HTMLElement | null;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { setMenuContext } from './menu.state.svelte';
	import { setMenuPortal } from './menu.portal.svelte';

	let { children, portalled = true, portalRef = undefined, value }: MenuRootProviderProps = $props();

	const api = untrack(() => value);
	setMenuContext(api);
	setMenuPortal({ portalled: () => portalled, portalRef: () => portalRef ?? undefined });
</script>

{@render children?.()}
