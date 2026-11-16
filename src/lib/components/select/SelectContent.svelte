<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SelectContentProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Select.module.css';
	import { useSelectContext } from './select.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: SelectContentProps =
		$props();

	const api = useSelectContext();
	const attrs = $derived(api.contentAttrs());

	$effect(() => {
		api.registerContent(ref as HTMLElement | null);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="select"
	data-part="content"
	data-slot="select-content"
	class={cn(styles.content, className)}
>
	{@render children?.()}
</Element>
