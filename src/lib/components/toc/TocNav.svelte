<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface TocNavProps
		extends HTMLProps<'nav'>, PolymorphicProps<'nav'>, RefAttribute {
		placement?: 'left' | 'right';
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Toc.module.css';
	import { useTocContext } from './toc.state.svelte';

	let {
		asChild,
		children,
		class: className,
		placement,
		ref = $bindable(null),
		...props
	}: TocNavProps = $props();

	const api = useTocContext();
	const attrs = $derived(api.navAttrs());
</script>

<Element
	as="nav"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="toc"
	data-part="nav"
	data-placement={placement}
	data-slot="toc-nav"
	class={cn(styles.nav, className)}
>
	{@render children?.()}
</Element>
