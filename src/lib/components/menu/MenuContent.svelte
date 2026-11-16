<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface MenuContentProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { useDismissableLayer, useEscapeLayer } from '../../internal/layers.svelte';
	import styles from './Menu.module.css';
	import { useMenuContext } from './menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: MenuContentProps = $props();

	const api = useMenuContext();
	const attrs = $derived(api.contentAttrs());

	$effect(() => {
		api.registerContent(ref as HTMLElement | null);
	});

	useEscapeLayer({
		enabled: () => api.open && api.closeOnEscape,
		onEscape: (event) => api.handleEscapeKeyDown(event)
	});

	useDismissableLayer({
		enabled: () => api.open && !!api.contentNode,
		getNode: () => api.contentNode,
		getExclude: () => [api.triggerNode, ...api.contextTriggerNodes()],
		onPointerDownOutside: (event) => api.handlePointerDownOutside(event),
		onFocusOutside: (event) => api.handleFocusOutside(event),
		onInteractOutside: (event) => api.handleInteractOutside(event)
	});
</script>

{#if api.present}
	<Element
		as="div"
		{...props}
		{...attrs}
		style={mergeStyleDeclarations(attrs.style, props.style)}
		bind:ref
		{asChild}
		data-slot="menu-content"
		class={cn(styles.content, className)}
	>
		{@render children?.()}
	</Element>
{/if}
