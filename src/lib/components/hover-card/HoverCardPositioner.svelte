<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface HoverCardPositionerProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import Portal from '../../internal/Portal.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './HoverCard.module.css';
	import { useHoverCardContext } from './hover-card.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		style,
		...props
	}: HoverCardPositionerProps = $props();

	const api = useHoverCardContext();

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
			data-scope="hover-card"
			data-part="positioner"
			data-slot="hover-card-positioner"
			style={mergeStyleDeclarations(api.positionerStyle, style)}
			class={cn(styles.positioner, className)}
		>
			{@render children?.()}
		</Element>
	</Portal>
{/if}
