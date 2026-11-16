<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseRadioGroupProps } from './radio-group.state.svelte';

	export type RadioGroupSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

	export interface RadioGroupRootProps
		extends UseRadioGroupProps, HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		size?: RadioGroupSize;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './RadioGroup.module.css';
	import { createRadioGroup, setRadioGroupContext } from './radio-group.state.svelte';

	let {
		asChild,
		children,
		class: className,
		defaultValue,
		dir,
		disabled,
		id,
		ids,
		invalid,
		name,
		form,
		onValueChange,
		orientation,
		readOnly,
		ref = $bindable(null),
		required,
		size = 'md',
		value = $bindable(),
		...props
	}: RadioGroupRootProps = $props();

	const uid = $props.id();
	const api = createRadioGroup(
		() => ({
			defaultValue,
			dir,
			disabled,
			form,
			id,
			ids,
			invalid,
			name,
			onValueChange(details) {
				onValueChange?.(details);
				value = details.value;
			},
			orientation,
			readOnly,
			required,
			value
		}),
		uid
	);
	setRadioGroupContext(api);
	const attrs = $derived(api.rootAttrs());

	$effect(() => {
		api.registerRoot(ref);
	});

	$effect(() => {
		api.value;
		api.measure();
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
	data-slot="radio-group-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
