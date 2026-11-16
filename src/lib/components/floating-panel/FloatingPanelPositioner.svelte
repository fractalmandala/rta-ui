<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FloatingPanelPositionerProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import Portal from '../../internal/Portal.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { useFloatingPanelContext } from './floating-panel.state.svelte';

	let {
		asChild,
		children,
		ref = $bindable(null),
		style,
		...props
	}: FloatingPanelPositionerProps = $props();

	const api = useFloatingPanelContext();
	const attrs = $derived(api.positionerAttrs());

	$effect(() => {
		const element = ref as HTMLElement | null;
		if (!element) return;
		api.setPositionerNode(element);
		return () => api.setPositionerNode(null);
	});
</script>

{#if api.present}
	<Portal to={api.portalTarget} disabled={!api.portalled}>
		<Element
			as="div"
			{...props}
			{...attrs}
			style={mergeStyleDeclarations(attrs.style, style)}
			bind:ref
			{asChild}
			data-scope="floating-panel"
			data-part="positioner"
			data-slot="floating-panel-positioner"
		>
			{@render children?.()}
		</Element>
	</Portal>
{/if}
