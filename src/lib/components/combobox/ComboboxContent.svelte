<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ComboboxContentProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Combobox.module.css';
	import { useComboboxContext } from './combobox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ComboboxContentProps = $props();

	const api = useComboboxContext();
	const attrs = $derived(api.contentAttrs());

	$effect(() => {
		api.registerContent(ref);
	});
</script>

{#if api.present}
	<Element
		as="div"
		{...props}
		bind:ref
		{asChild}
		{...attrs}
		style={mergeStyleDeclarations(attrs.style, props.style)}
		data-scope="combobox"
		data-part="content"
		data-slot="combobox-content"
		class={cn(styles.content, className)}
	>
		{@render children?.()}
	</Element>
{/if}
