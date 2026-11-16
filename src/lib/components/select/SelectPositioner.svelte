<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SelectPositionerProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import Portal from '../../internal/Portal.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Select.module.css';
	import { useSelectContext } from './select.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: SelectPositionerProps = $props();

	const api = useSelectContext();
	const attrs = $derived(api.positionerAttrs());

	$effect(() => {
		api.registerPositioner(ref as HTMLElement | null);
	});
</script>

{#if api.presence.present}
	<Portal disabled={!api.portalled} to={api.portalTarget}>
		<Element
			as="div"
			{...props}
			bind:ref
			{asChild}
			{...attrs}
			style={mergeStyleDeclarations(attrs.style, props.style)}
			data-scope="select"
			data-part="positioner"
			data-slot="select-positioner"
			class={cn(styles.positioner, className)}
		>
			{@render children?.()}
		</Element>
	</Portal>
{/if}
