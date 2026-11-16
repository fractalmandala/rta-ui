<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { FieldApi } from './field.state.svelte';

	export interface FieldRootProviderProps
		extends Omit<HTMLProps<'div'>, 'id'>, PolymorphicProps<'div'>, RefAttribute {
		value: FieldApi;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Field.module.css';
	import { setFieldContext } from './field.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: FieldRootProviderProps = $props();

	const api = untrack(() => value);
	setFieldContext(api);

	const attrs = $derived(api.rootAttrs());

	$effect(() => {
		api.setRootRef(ref ?? null);
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="field"
	data-part="root"
	data-slot="field-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
