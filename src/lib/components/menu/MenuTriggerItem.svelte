<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface MenuTriggerItemProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Menu.module.css';
	import {
		setMenuItemPropsContext,
		useMenuContext,
		useMenuTriggerItemContext
	} from './menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: MenuTriggerItemProps = $props();

	const api = useMenuContext();
	const triggerItemAttrs = useMenuTriggerItemContext();
	const attrs = $derived(triggerItemAttrs?.() ?? {});

	setMenuItemPropsContext({
		get value() {
			return String(attrs['data-value'] ?? '');
		}
	});

	$effect(() => {
		api.registerTrigger(ref as HTMLElement | null);
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-slot="menu-trigger-item"
	class={cn(styles.triggerItem, className)}
>
	{@render children?.()}
</Element>
