<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ProgressCircularCircleTrackProps
		extends HTMLProps<'circle'>, PolymorphicProps<'circle'>, RefAttribute {
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './ProgressCircular.module.css';
	import { useProgressContext } from '../progress/progress.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ProgressCircularCircleTrackProps = $props();

	const api = useProgressContext();
	const attrs = $derived(api.circleTrackAttrs());
</script>

<Element
	as="circle"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="progress"
	data-part="circle-track"
	data-slot="progress-circular-circle-track"
	class={cn(styles.circleTrack, className)}
>
	{@render children?.()}
</Element>
