<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface NavigationMenuContentProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		value?: string;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import Portal from '../../internal/Portal.svelte';
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
		ref = $bindable(null),
		value = undefined,
		...props
	}: NavigationMenuContentProps = $props();

	const api = useNavigationMenuContext();
	const item = useNavigationMenuItemPropsContext();
	const itemValue = $derived(value ?? item?.().value ?? '');
	const attrs = $derived(api.contentAttrs({ value: itemValue }));
	const presence = untrack(() =>
		api.createContentPresence(value ?? item?.().value ?? '', () => ref as HTMLElement | null)
	);

	$effect(() => {
		const element = ref as HTMLElement | null;
		if (!element) return;
		return api.registerContent(itemValue, element);
	});
</script>

{#snippet element()}
	<Element
		as="div"
		{...props}
		{...attrs}
		bind:ref
		{asChild}
		data-scope="navigation-menu"
		data-part="content"
		data-slot="navigation-menu-content"
		class={cn(styles.content, className)}
	>
		{@render children?.()}
	</Element>
{/snippet}

{#if api.isViewportRendered}
	<div {...api.viewportProxyAttrs({ value: itemValue })}></div>
	<div {...api.triggerProxyAttrs({ value: itemValue })}></div>
	{#if api.viewportNode && presence.present}
		<Portal to={api.viewportNode}>
			{@render element()}
		</Portal>
	{/if}
{:else if presence.present}
	{@render element()}
{/if}
