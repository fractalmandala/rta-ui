<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { CheckboxSize, UseCheckboxProps } from './checkbox.state.svelte';

	export interface CheckboxRootProps
		extends Omit<UseCheckboxProps, 'form'>,
			HTMLProps<'label'>,
			PolymorphicProps<'label'>,
			RefAttribute {
		form?: string;
		size?: CheckboxSize;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Checkbox.module.css';
	import { createCheckbox, setCheckboxContext } from './checkbox.state.svelte';

	let {
		asChild,
		checked = $bindable(),
		children,
		class: className,
		defaultChecked,
		dir,
		disabled,
		form,
		id,
		ids,
		indeterminate,
		invalid,
		name,
		onCheckedChange,
		readOnly,
		ref = $bindable(null),
		required,
		size = 'md',
		value,
		...props
	}: CheckboxRootProps = $props();

	const uid = $props.id();
	const api = createCheckbox(
		() => ({
			checked,
			defaultChecked,
			dir,
			disabled,
			form,
			id,
			ids,
			indeterminate,
			invalid,
			name,
			onCheckedChange(details) {
				onCheckedChange?.(details);
				if (checked !== undefined) checked = details.checked;
			},
			readOnly,
			required,
			value
		}),
		uid
	);
	setCheckboxContext(api);
	const attrs = $derived(api.dataAttrs());
</script>

<Element
	as="label"
	{...props}
	bind:ref
	{asChild}
	id={api.id('root')}
	dir={api.dir}
	for={api.id('hiddenInput')}
	data-scope="checkbox"
	data-part="root"
	data-size={size}
	data-slot="checkbox-root"
	onpointermove={() => api.setHovered(true)}
	onpointerleave={() => api.setHovered(false)}
	class={cn(styles.root, className)}
	{...attrs}
>
	{@render children?.()}
</Element>
