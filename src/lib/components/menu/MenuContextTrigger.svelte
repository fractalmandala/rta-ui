<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface MenuContextTriggerProps
		extends Omit<HTMLProps<'button'>, 'type'>,
			PolymorphicProps<'button'>,
			RefAttribute {
		value?: string | null;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { useMenuContext } from './menu.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value = null,
		...props
	}: MenuContextTriggerProps = $props();

	const api = useMenuContext();
	const attrs = $derived(api.contextTriggerAttrs({ value }));

	$effect(() => {
		api.registerContentTrigger(value, ref as HTMLElement | null);
	});
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-slot="menu-context-trigger"
	class={className}
>
	{@render children?.()}
</Element>
