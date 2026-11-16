<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { CheckboxApi, CheckboxSize } from './checkbox.state.svelte';

	export interface CheckboxRootProviderProps
		extends HTMLProps<'label'>, PolymorphicProps<'label'>, RefAttribute {
		value: CheckboxApi;
		size?: CheckboxSize;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Checkbox.module.css';
	import { setCheckboxContext } from './checkbox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		size = 'md',
		value,
		...props
	}: CheckboxRootProviderProps = $props();

	const api = untrack(() => value);
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
	data-slot="checkbox-root-provider"
	onpointermove={() => api.setHovered(true)}
	onpointerleave={() => api.setHovered(false)}
	class={cn(styles.root, className)}
	{...attrs}
>
	{@render children?.()}
</Element>
