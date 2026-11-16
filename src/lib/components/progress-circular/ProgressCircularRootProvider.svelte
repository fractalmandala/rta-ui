<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ProgressApi } from '../progress/progress.state.svelte';

	export interface ProgressCircularRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: ProgressApi;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './ProgressCircular.module.css';
	import { setProgressContext } from '../progress/progress.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: ProgressCircularRootProviderProps = $props();

	const api = untrack(() => value);
	setProgressContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="progress"
	data-part="root"
	data-slot="progress-circular-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
