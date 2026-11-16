<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ToggleIndicatorProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import styles from './Toggle.module.css';
	import { useToggleContext } from './toggle.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ToggleIndicatorProps = $props();

	const api = useToggleContext();
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	data-scope="toggle"
	data-part="indicator"
	data-state={api.state}
	data-pressed={dataAttr(api.pressed)}
	data-disabled={dataAttr(api.disabled)}
	data-slot="toggle-indicator"
	class={cn(styles.indicator, className)}
>
	{@render children?.()}
</Element>
