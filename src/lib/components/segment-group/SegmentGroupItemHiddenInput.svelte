<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SegmentGroupItemHiddenInputProps
		extends HTMLProps<'input'>, PolymorphicProps<'input'>, RefAttribute {
		value: string;
		disabled?: boolean;
		invalid?: boolean;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { isFocusVisible } from '../../internal/dom.js';
	import { useSegmentGroupContext } from './segment-group.state.svelte';

	let {
		asChild,
		disabled,
		invalid,
		ref = $bindable(null),
		value,
		...props
	}: SegmentGroupItemHiddenInputProps = $props();

	const api = useSegmentGroupContext();
	const state = $derived(api.itemState(value, { disabled, invalid }));
	const attrs = $derived(api.hiddenInputAttrs(value, { disabled, invalid }));
</script>

<Element
	as="input"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="segment-group"
	data-part="item-hidden-input"
	data-slot="segment-group-item-hidden-input"
	onclick={(event) => {
		if (api.readOnly) {
			event.preventDefault();
			return;
		}
		if (event.currentTarget.checked) api.setValue(value);
	}}
	onfocus={(event) => api.setFocused(value, isFocusVisible(event.currentTarget))}
	onblur={() => api.setFocused(null)}
	onkeydown={(event) => {
		if (event.defaultPrevented) return;
		if (event.key === ' ') api.setActive(value);
	}}
	onkeyup={(event) => {
		if (event.defaultPrevented) return;
		if (event.key === ' ') api.setActive(null);
	}}
/>
