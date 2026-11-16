<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SwitchLabelProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Switch.module.css';
	import { useSwitchContext } from './switch.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: SwitchLabelProps =
		$props();

	const api = useSwitchContext();
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	dir={api.dir}
	data-scope="switch"
	data-part="label"
	data-slot="switch-label"
	class={cn(styles.label, className)}
	{...api.labelProps()}
>
	{@render children?.()}
</Element>
