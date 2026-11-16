<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseFieldsetProps } from './fieldset.state.svelte';

	export interface FieldsetRootProps
		extends UseFieldsetProps,
			Omit<HTMLProps<'fieldset'>, 'disabled'>,
			PolymorphicProps<'fieldset'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Fieldset.module.css';
	import { createFieldset, setFieldsetContext } from './fieldset.state.svelte';

	let {
		asChild,
		children,
		class: className,
		disabled,
		id,
		invalid,
		ref = $bindable(null),
		...props
	}: FieldsetRootProps = $props();

	const uid = $props.id();
	const api = createFieldset(() => ({ id, disabled, invalid }), uid);
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
	data-slot="fieldset-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
