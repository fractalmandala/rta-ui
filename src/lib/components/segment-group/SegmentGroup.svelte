<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseSegmentGroupProps } from './segment-group.state.svelte';

	export type SegmentGroupSize = 'sm' | 'md' | 'lg';

	export interface SegmentGroupRootProps
		extends UseSegmentGroupProps, HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		size?: SegmentGroupSize;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './SegmentGroup.module.css';
	import { createSegmentGroup, setSegmentGroupContext } from './segment-group.state.svelte';

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
	}: SegmentGroupRootProps = $props();

	const uid = $props.id();
	const api = createSegmentGroup(
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
	setSegmentGroupContext(api);
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
	data-scope="segment-group"
	data-part="root"
	data-size={size}
	data-slot="segment-group-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
