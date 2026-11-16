<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseFieldProps } from './field.state.svelte';

	export interface FieldRootProps
		extends UseFieldProps,
			Omit<HTMLProps<'div'>, 'id'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Field.module.css';
	import { createField, setFieldContext } from './field.state.svelte';

	let {
		asChild,
		children,
		class: className,
		disabled,
		id,
		ids,
		invalid,
		readOnly,
		ref = $bindable(null),
		required,
		target,
		...props
	}: FieldRootProps = $props();

	const uid = $props.id();
	const api = createField(
		() => ({ id, ids, disabled, invalid, readOnly, required, target }),
		uid
	);
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
	data-slot="field-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
