<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TooltipPositionerProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import Portal from '../../internal/Portal.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Tooltip.module.css';
	import { useTooltipContext } from './tooltip.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		style,
		...props
	}: TooltipPositionerProps = $props();

	const api = useTooltipContext();

	$effect(() => {
		const element = ref as HTMLElement | null;
		api.setPositionerNode(element);
		return () => api.setPositionerNode(null);
	});
</script>

{#if api.present}
	<Portal to={api.portalTarget} disabled={!api.portalled}>
		<Element
			as="div"
			{...props}
			bind:ref
			{asChild}
			id={api.positionerId}
			dir={api.dir}
			data-scope="tooltip"
			data-part="positioner"
			data-slot="tooltip-positioner"
			style={mergeStyleDeclarations(api.positionerStyle, style)}
			class={cn(styles.positioner, className)}
		>
			{@render children?.()}
		</Element>
	</Portal>
{/if}
