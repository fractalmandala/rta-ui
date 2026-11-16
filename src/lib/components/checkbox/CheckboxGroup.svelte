<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseCheckboxGroupProps } from './checkbox.state.svelte';

	export interface CheckboxGroupProps
		extends UseCheckboxGroupProps, HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Checkbox.module.css';
	import { createCheckboxGroup, setCheckboxGroupContext } from './checkbox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		defaultValue,
		dir,
		disabled,
		id,
		ids,
		invalid,
		name,
		onValueChange,
		readOnly,
		ref = $bindable(null),
		required,
		value = $bindable(),
		...props
	}: CheckboxGroupProps = $props();

	const uid = $props.id();
	const api = createCheckboxGroup(
		() => ({
			defaultValue,
			dir,
			disabled,
			id,
			ids,
			invalid,
			name,
			onValueChange(details) {
				onValueChange?.(details);
				value = details.value;
			},
			readOnly,
			required,
			value
		}),
		uid
	);
	setCheckboxGroupContext(api);
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.groupId}
	dir={api.dir}
	data-scope="checkbox"
	data-part="group"
	data-slot="checkbox-group"
	class={cn(styles.group, className)}
	{...api.groupAttrs()}
>
	{@render children?.()}
</Element>
