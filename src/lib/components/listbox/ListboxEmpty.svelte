<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ListboxEmptyProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Listbox.module.css';
	import { useListboxContext } from './listbox.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: ListboxEmptyProps =
		$props();

	const api = useListboxContext();
</script>

{#if api.isEmpty}
	<Element
		as="div"
		{...props}
		bind:ref
		{asChild}
		role="presentation"
		data-scope="listbox"
		data-part="empty"
		data-slot="listbox-empty"
		class={cn(styles.empty, className)}
	>
		{@render children?.()}
	</Element>
{/if}
