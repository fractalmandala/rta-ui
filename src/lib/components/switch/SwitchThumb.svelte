<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SwitchThumbProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Switch.module.css';
	import { useSwitchContext } from './switch.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: SwitchThumbProps =
		$props();

	const api = useSwitchContext();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.id('thumb')}
	dir={api.dir}
	data-scope="switch"
	data-part="thumb"
	aria-hidden="true"
	data-slot="switch-thumb"
	class={cn(styles.thumb, className)}
	{...api.dataAttrs()}
>
	{@render children?.()}
</Element>
