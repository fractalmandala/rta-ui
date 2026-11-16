<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface MenuItemShortcutProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Menu.module.css';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: MenuItemShortcutProps =
		$props();
</script>

<Element as="span" {...props} bind:ref {asChild} data-slot="menu-item-shortcut" class={cn(styles.itemShortcut, className)}>
	{@render children?.()}
</Element>
