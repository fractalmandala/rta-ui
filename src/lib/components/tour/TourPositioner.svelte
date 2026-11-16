<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TourPositionerProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute<HTMLDivElement> {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import Portal from '../../internal/Portal.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Tour.module.css';
	import { useTourContext } from './tour.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), style, ...props }: TourPositionerProps =
		$props();

	const api = useTourContext();

	$effect(() => {
		api.setPositionerNode(ref as HTMLElement | null);
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
			data-scope="tour"
			data-part="positioner"
			data-type={api.step?.type}
			data-placement={api.placement}
			data-side={api.side}
			data-instant={dataAttr(api.instant)}
			data-slot="tour-positioner"
			style={mergeStyleDeclarations(api.positionerStyle, style)}
			class={cn(styles.positioner, className)}
		>
			{@render children?.()}
		</Element>
	</Portal>
{/if}
