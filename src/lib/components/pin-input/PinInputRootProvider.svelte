<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { PinInputApi } from './pin-input.state.svelte';
	import type { PinInputSize } from './PinInput.svelte';

	export interface PinInputRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: PinInputApi;
		size?: PinInputSize;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './PinInput.module.css';
	import { setPinInputContext } from './pin-input.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		size = 'md',
		value,
		...props
	}: PinInputRootProviderProps = $props();

	const api = untrack(() => value);
	setPinInputContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="pin-input"
	data-part="root"
	data-size={size}
	data-slot="pin-input-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
