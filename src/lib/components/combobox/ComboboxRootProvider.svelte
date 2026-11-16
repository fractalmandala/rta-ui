<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ComboboxApi } from './combobox.state.svelte';

	export interface ComboboxRootProviderProps
		extends Omit<HTMLProps<'div'>, 'id'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		value: ComboboxApi;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Combobox.module.css';
	import { setComboboxContext } from './combobox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: ComboboxRootProviderProps = $props();

	const api = untrack(() => value);
	setComboboxContext(api);

	const attrs = $derived(api.rootAttrs());
	const hidden = $derived(api.hiddenInputs());

	$effect(() => {
		api.registerRoot(ref);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="combobox"
	data-part="root"
	data-slot="combobox-root-provider"
	class={cn(styles.root, className)}
>
	{#each hidden as input (input.id)}
		<input
			type="hidden"
			id={input.id}
			name={input.name}
			form={input.form}
			value={input.value}
			data-scope="combobox"
			data-part="hidden-input"
		/>
	{/each}
	{@render children?.()}
</Element>
