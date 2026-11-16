<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { RadioGroupSize } from './RadioGroup.svelte';
	import type { RadioGroupApi } from './radio-group.state.svelte';

	export interface RadioGroupRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: RadioGroupApi;
		size?: RadioGroupSize;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './RadioGroup.module.css';
	import { setRadioGroupContext } from './radio-group.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		size = 'md',
		value,
		...props
	}: RadioGroupRootProviderProps = $props();

	const api = untrack(() => value);
	setRadioGroupContext(api);
	const attrs = $derived(api.rootAttrs());

	$effect(() => {
		api.registerRoot(ref);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="radio-group"
	data-part="root"
	data-size={size}
	data-slot="radio-group-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
