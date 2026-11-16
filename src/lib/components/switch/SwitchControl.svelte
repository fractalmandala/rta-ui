<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SwitchControlProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Switch.module.css';
	import SwitchThumb from './SwitchThumb.svelte';
	import { useSwitchContext } from './switch.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: SwitchControlProps =
		$props();

	const api = useSwitchContext();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	dir={api.dir}
	data-scope="switch"
	data-part="control"
	data-slot="switch-control"
	class={cn(styles.control, className)}
	{...api.controlProps()}
>
	{#if children}
		{@render children()}
	{:else}
		<SwitchThumb />
	{/if}
</Element>
