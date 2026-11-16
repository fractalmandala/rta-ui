<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface LightboxViewportProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { useDialogContext } from '../dialog/dialog.state.svelte';
	import { useLightboxContext } from './lightbox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onkeydown,
		ref = $bindable(null),
		...props
	}: LightboxViewportProps = $props();

	const api = useLightboxContext();
	const dialog = useDialogContext();
	const attrs = $derived(api.viewportAttrs());
	const viewportStyle = 'display: grid; place-items: center; overflow: hidden; max-width: 100%;';

	$effect(() => {
		api.registerViewport(ref);
		return () => api.registerViewport(null);
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(viewportStyle, props.style)}
	bind:ref
	{asChild}
	data-scope="lightbox"
	data-part="viewport"
	data-slot="lightbox-viewport"
	data-state={dialog.open ? 'open' : 'closed'}
	data-index={api.index}
	class={cn(className)}
	onkeydown={(event) => {
		onkeydown?.(event);
		if (event.defaultPrevented) return;
		api.handleKeydown(event);
	}}
>
	{@render children?.()}
</Element>
