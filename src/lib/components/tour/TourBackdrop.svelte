<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TourBackdropProps
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

	let { asChild, children, class: className, ref = $bindable(null), style, ...props }: TourBackdropProps =
		$props();

	const api = useTourContext();
</script>

{#if api.present}
	<Portal to={api.portalTarget} disabled={!api.portalled}>
		<Element
			as="div"
			{...props}
			bind:ref
			{asChild}
			id={api.backdropId}
			dir={api.dir}
			hidden={!api.open || !api.backdrop}
			data-scope="tour"
			data-part="backdrop"
			data-state={api.dataState}
			data-type={api.step?.type}
			data-instant={dataAttr(api.instant)}
			data-slot="tour-backdrop"
			style={mergeStyleDeclarations(api.backdropStyle, style)}
			class={cn(styles.backdrop, className)}
		>
			{@render children?.()}
		</Element>
	</Portal>
{/if}
