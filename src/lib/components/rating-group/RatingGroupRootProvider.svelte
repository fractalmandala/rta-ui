<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { RatingGroupApi } from './rating-group.state.svelte';
	import type { RatingGroupSize } from './RatingGroup.svelte';

	export interface RatingGroupRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: RatingGroupApi;
		size?: RatingGroupSize;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './RatingGroup.module.css';
	import { setRatingGroupContext } from './rating-group.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		size = 'md',
		value,
		...props
	}: RatingGroupRootProviderProps = $props();

	const api = untrack(() => value);
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
	data-slot="rating-group-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
