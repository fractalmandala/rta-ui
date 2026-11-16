<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface NavigationMenuTriggerProps
		extends Omit<HTMLProps<'button'>, 'type' | 'value'>,
			PolymorphicProps<'button'>,
			RefAttribute {
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './NavigationMenu.module.css';
	import {
		useNavigationMenuContext,
		useNavigationMenuItemPropsContext
	} from './navigation-menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		disabled,
		ref = $bindable(null),
		...props
	}: NavigationMenuTriggerProps = $props();

	const api = useNavigationMenuContext();
	const item = useNavigationMenuItemPropsContext();
	const attrs = $derived(
		api.triggerAttrs({ value: item?.().value ?? '', disabled: disabled ?? item?.().disabled })
	);

	$effect(() => {
		const element = ref as HTMLElement | null;
		const value = item?.().value;
		if (!element || !value) return;
		return api.registerTrigger(value, element);
	});
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="navigation-menu"
	data-part="trigger"
	data-slot="navigation-menu-trigger"
	class={cn(!asChild && styles.trigger, className)}
>
	{@render children?.()}
</Element>
