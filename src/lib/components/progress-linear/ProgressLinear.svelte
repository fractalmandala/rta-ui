<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseProgressProps } from '../progress/progress.state.svelte';

	export interface ProgressLinearRootProps
		extends UseProgressProps, HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './ProgressLinear.module.css';
	import { createProgress, setProgressContext } from '../progress/progress.state.svelte';

	let {
		asChild,
		children,
		class: className,
		defaultValue,
		dir,
		formatOptions,
		id,
		ids,
		locale,
		max,
		min,
		onValueChange,
		orientation,
		ref = $bindable(null),
		translations,
		value = $bindable(),
		...props
	}: ProgressLinearRootProps = $props();

	const uid = $props.id();
	const api = createProgress(
		() => ({
			defaultValue,
			dir,
			formatOptions,
			id,
			ids,
			locale,
			max,
			min,
			orientation,
			translations,
			value,
			onValueChange(details) {
				onValueChange?.(details);
				value = details.value ?? undefined;
			}
		}),
		uid
	);
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
	data-slot="progress-linear-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
