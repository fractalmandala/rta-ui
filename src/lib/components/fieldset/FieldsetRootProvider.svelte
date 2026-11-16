<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { FieldsetApi } from './fieldset.state.svelte';

	export interface FieldsetRootProviderProps
		extends Omit<HTMLProps<'fieldset'>, 'disabled'>,
			PolymorphicProps<'fieldset'>,
			RefAttribute {
		value: FieldsetApi;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Fieldset.module.css';
	import { setFieldsetContext } from './fieldset.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: FieldsetRootProviderProps = $props();

	const api = untrack(() => value);
	setFieldsetContext(api);

	const attrs = $derived(api.rootAttrs());

	$effect(() => {
		api.setRootRef(ref ?? null);
	});
</script>

<Element
	as="fieldset"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="fieldset"
	data-part="root"
	data-slot="fieldset-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
