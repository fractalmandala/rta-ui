<script lang="ts">
	import { getAllContexts, mount, unmount } from 'svelte';
	import type { Snippet } from 'svelte';

	export interface PortalProps {
		/** Where to render. Defaults to `document.body`. */
		to?: Element | string | null;
		/** Render in place instead of portalling. */
		disabled?: boolean;
		children?: Snippet;
	}

	let { to, disabled = false, children }: PortalProps = $props();

	const context = getAllContexts();
	let host: HTMLElement | null = $state(null);
	let instance: Record<string, unknown> | null = null;

	function resolveTarget(): Element | null {
		if (typeof document === 'undefined') return null;
		if (!to) return document.body;
		if (typeof to === 'string') return document.querySelector(to);
		return to;
	}

	$effect(() => {
		if (disabled) return;
		const target = resolveTarget();
		if (!target) return;

		const node = document.createElement('div');
		node.setAttribute('data-rta-portal', '');
		node.style.display = 'contents';
		target.appendChild(node);
		host = node;

		return () => {
			node.remove();
			host = null;
		};
	});

	$effect(() => {
		if (disabled || !host || !children) return;
		const from = host;
		instance = mount(PortalContent, {
			target: from,
			props: { children },
			context
		}) as Record<string, unknown>;

		return () => {
			if (instance) unmount(instance);
			instance = null;
		};
	});
</script>

<script lang="ts" module>
	import PortalContent from './PortalContent.svelte';
</script>

{#if disabled}
	{@render children?.()}
{/if}
