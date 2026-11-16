<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TourSpotlightProps
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

	let { asChild, children, class: className, ref = $bindable(null), style, ...props }: TourSpotlightProps =
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
			hidden={!api.open || !api.target}
			data-scope="tour"
			data-part="spotlight"
			data-instant={dataAttr(api.instant)}
			data-slot="tour-spotlight"
			style={mergeStyleDeclarations(api.spotlightStyle, style)}
			class={cn(styles.spotlight, className)}
		>
			{@render children?.()}
		</Element>
	</Portal>
{/if}
