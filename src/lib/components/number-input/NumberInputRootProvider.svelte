<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { NumberInputApi } from './number-input.state.svelte';
	import type { NumberInputSize } from './NumberInput.svelte';

	export interface NumberInputRootProviderProps
		extends Omit<HTMLProps<'div'>, 'size'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		value: NumberInputApi;
		size?: NumberInputSize;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './NumberInput.module.css';
	import { setNumberInputContext } from './number-input.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		size = 'md',
		value,
		...props
	}: NumberInputRootProviderProps = $props();

	const api = untrack(() => value);
	setNumberInputContext(api);

	const attrs = $derived(api.rootAttrs());

	$effect(() => {
		api.registerRoot(ref);
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="number-input"
	data-part="root-provider"
	data-slot="number-input-root-provider"
	data-size={size}
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
