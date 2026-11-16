<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface FieldItemProps
		extends Omit<HTMLProps<'div'>, 'children'>, PolymorphicProps<'div'>, RefAttribute {
		value: string;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Field.module.css';
	import { createFieldItem, setFieldContext, useFieldContext } from './field.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		value,
		...props
	}: FieldItemProps = $props();

	const parent = useFieldContext();
	if (!parent) {
		throw new Error('FieldItem must be used within Field');
	}

	setFieldContext(createFieldItem(parent, () => value));
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	data-scope="field"
	data-part="item"
	data-slot="field-item"
	class={cn(styles.item, className)}
>
	{@render children?.()}
</Element>
