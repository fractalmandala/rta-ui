<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SelectTriggerProps
		extends Omit<HTMLProps<'button'>, 'type'>,
			PolymorphicProps<'button'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Select.module.css';
	import { useSelectContext } from './select.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: SelectTriggerProps = $props();

	const api = useSelectContext();
	const attrs = $derived(api.triggerAttrs());

	$effect(() => {
		api.registerTrigger(ref as HTMLElement | null);
	});
</script>

<!-- An asChild host keeps its own styling. -->
<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="select"
	data-part="trigger"
	data-slot="select-trigger"
	class={cn(!asChild && styles.trigger, className)}
>
	{@render children?.()}
</Element>
