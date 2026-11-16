<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface RadioGroupIndicatorProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import styles from './RadioGroup.module.css';
	import { useRadioGroupContext } from './radio-group.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: RadioGroupIndicatorProps = $props();

	const api = useRadioGroupContext();

	$effect(() => {
		api.value;
		api.measure();
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.indicatorId}
	dir={api.dir}
	hidden={api.value == null || api.indicatorRect == null}
	data-scope="radio-group"
	data-part="indicator"
	data-disabled={dataAttr(api.disabled)}
	data-orientation={api.orientation}
	data-slot="radio-group-indicator"
	style={api.indicatorStyle()}
	class={cn(styles.indicator, className)}
>
	{@render children?.()}
</Element>
