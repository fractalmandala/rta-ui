<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { SwitchSize, UseSwitchProps } from './switch.state.svelte';

	export interface SwitchRootProps
		extends Omit<UseSwitchProps, 'form'>,
			HTMLProps<'label'>,
			PolymorphicProps<'label'>,
			RefAttribute {
		form?: string;
		size?: SwitchSize;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Switch.module.css';
	import { createSwitch, setSwitchContext } from './switch.state.svelte';

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
		invalid,
		name,
		onCheckedChange,
		readOnly,
		ref = $bindable(null),
		required,
		size = 'md',
		value,
		...props
	}: SwitchRootProps = $props();

	const uid = $props.id();
	const api = createSwitch(
		() => ({
			checked,
			defaultChecked,
			dir,
			disabled,
			form,
			id,
			ids,
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
	setSwitchContext(api);
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
	data-scope="switch"
	data-part="root"
	data-size={size}
	data-slot="switch-root"
	onpointermove={() => api.setHovered(true)}
	onpointerleave={() => api.setHovered(false)}
	class={cn(styles.root, className)}
	{...attrs}
>
	{@render children?.()}
</Element>
