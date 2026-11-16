<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { SwitchApi, SwitchSize } from './switch.state.svelte';

	export interface SwitchRootProviderProps
		extends HTMLProps<'label'>, PolymorphicProps<'label'>, RefAttribute {
		value: SwitchApi;
		size?: SwitchSize;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Switch.module.css';
	import { setSwitchContext } from './switch.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		size = 'md',
		value,
		...props
	}: SwitchRootProviderProps = $props();

	const api = untrack(() => value);
	setSwitchContext(api);
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
	data-slot="switch-root-provider"
	onpointermove={() => api.setHovered(true)}
	onpointerleave={() => api.setHovered(false)}
	class={cn(styles.root, className)}
	{...api.dataAttrs()}
>
	{@render children?.()}
</Element>
