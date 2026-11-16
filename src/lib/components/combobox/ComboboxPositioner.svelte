<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ComboboxPositionerProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import Portal from '../../internal/Portal.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { getPlacement } from '../../internal/positioning.svelte.js';
	import styles from './Combobox.module.css';
	import { useComboboxContext } from './combobox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ComboboxPositionerProps = $props();

	const api = useComboboxContext();
	const attrs = $derived(api.positionerAttrs());

	let node = $state<HTMLElement | null>(null);

	$effect(() => {
		node = ref as HTMLElement | null;
	});

	$effect(() => {
		const floating = node;
		if (!floating || !api.open) return;
		const options = api.positioning;
		const anchor = api.anchorNode;
		if (!anchor) return;
		return getPlacement(() => api.anchorNode, () => floating, {
			...options,
			gutter: options.gutter ?? 8,
			listeners: true,
			onComplete(result) {
				api.setCurrentPlacement(result.placement);
				options.onComplete?.(result);
			}
		});
	});
</script>

{#if api.present}
	<Portal to={api.portalTarget} disabled={!api.portalled}>
		<Element
			as="div"
			{...props}
			bind:ref
			{asChild}
			{...attrs}
			style={mergeStyleDeclarations(attrs.style, props.style)}
			data-scope="combobox"
			data-part="positioner"
			data-slot="combobox-positioner"
			class={cn(styles.positioner, className)}
		>
			{@render children?.()}
		</Element>
	</Portal>
{/if}
