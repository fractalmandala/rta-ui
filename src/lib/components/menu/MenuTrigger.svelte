<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface MenuTriggerProps
		extends Omit<HTMLProps<'button'>, 'type'>,
			PolymorphicProps<'button'>,
			RefAttribute {
		/** Scopes a trigger to one value when several triggers drive the same menu. */
		value?: string | null;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeProps } from '../../internal/mergeProps.js';
	import { useMenuContext, useMenuTriggerItemContext } from './menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value = undefined,
		...props
	}: MenuTriggerProps = $props();

	const api = useMenuContext();
	const triggerItem = useMenuTriggerItemContext();
	const attrs = $derived(
		mergeProps(
			api.triggerAttrs({ value }) as Record<string, unknown>,
			triggerItem?.() ?? {}
		) as Record<string, unknown>
	);

	$effect(() => {
		api.registerTrigger(ref as HTMLElement | null);
	});
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-slot="menu-trigger"
	class={className}
>
	{@render children?.()}
</Element>
