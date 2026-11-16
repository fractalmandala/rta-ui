<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ListboxContentProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Listbox.module.css';
	import { useListboxContext } from './listbox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ListboxContentProps = $props();

	const api = useListboxContext();
	const attrs = $derived(api.contentAttrs());

	$effect(() => {
		api.registerContent(ref as HTMLElement | null);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="listbox"
	data-part="content"
	data-slot="listbox-content"
	class={cn(styles.content, className)}
>
	{@render children?.()}
</Element>
