<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CollapsibleBodyProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Collapsible.module.css';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: CollapsibleBodyProps =
		$props();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	data-scope="collapsible"
	data-part="body"
	data-slot="collapsible-body"
	class={cn(styles.body, className)}
>
	{@render children?.()}
</Element>
