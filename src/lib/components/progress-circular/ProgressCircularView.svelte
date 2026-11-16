<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ProgressCircularViewProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {
		state: 'indeterminate' | 'loading' | 'complete';
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
		state: viewState,
		...props
	}: ProgressCircularViewProps = $props();

	const api = useProgressContext();
	const attrs = $derived(api.viewAttrs({ state: viewState }));
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="progress"
	data-part="view"
	data-slot="progress-circular-view"
	class={cn(className)}
>
	{@render children?.()}
</Element>
