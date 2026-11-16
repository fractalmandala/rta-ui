<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ListboxInputProps as ListboxInputBehaviourProps } from './listbox.state.svelte';

	export interface ListboxInputProps
		extends Omit<HTMLProps<'input'>, 'type'>,
			ListboxInputBehaviourProps,
			PolymorphicProps<'input'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Listbox.module.css';
	import { useListboxContext } from './listbox.state.svelte';

	let {
		asChild,
		autoHighlight,
		class: className,
		keyboardPriority,
		ref = $bindable(null),
		...props
	}: ListboxInputProps = $props();

	const api = useListboxContext();
	const attrs = $derived(api.inputAttrs({ autoHighlight, keyboardPriority }));

	$effect(() => {
		api.registerInput(ref as HTMLElement | null);
	});
</script>

<Element
	as="input"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="listbox"
	data-part="input"
	data-slot="listbox-input"
	class={cn(styles.input, className)}
/>
