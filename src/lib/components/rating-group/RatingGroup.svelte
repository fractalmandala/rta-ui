<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseRatingGroupProps } from './rating-group.state.svelte';

	export type RatingGroupSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

	export interface RatingGroupRootProps
		extends UseRatingGroupProps, HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		size?: RatingGroupSize;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './RatingGroup.module.css';
	import { createRatingGroup, setRatingGroupContext } from './rating-group.state.svelte';

	let {
		allowHalf,
		asChild,
		children,
		class: className,
		count,
		defaultValue,
		dir,
		disabled,
		form,
		id,
		ids,
		name,
		onHoverChange,
		onValueChange,
		readOnly,
		ref = $bindable(null),
		required,
		size = 'md',
		translations,
		value = $bindable(),
		...props
	}: RatingGroupRootProps = $props();

	const uid = $props.id();
	const api = createRatingGroup(
		() => ({
			allowHalf,
			count,
			defaultValue,
			dir,
			disabled,
			form,
			id,
			ids,
			name,
			onHoverChange,
			onValueChange(details) {
				onValueChange?.(details);
				value = details.value;
			},
			readOnly,
			required,
			translations,
			value
		}),
		uid
	);
	setRatingGroupContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="rating-group"
	data-part="root"
	data-size={size}
	data-slot="rating-group-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
