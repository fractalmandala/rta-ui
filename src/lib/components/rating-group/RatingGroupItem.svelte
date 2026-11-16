<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface RatingGroupItemProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {
		index: number;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './RatingGroup.module.css';
	import { setRatingGroupItemContext, useRatingGroupContext } from './rating-group.state.svelte';

	let {
		asChild,
		children,
		class: className,
		index,
		ref = $bindable(null),
		...props
	}: RatingGroupItemProps = $props();

	const api = useRatingGroupContext();
	const attrs = $derived(api.itemAttrs(index));
	setRatingGroupItemContext(() => api.itemState(index));

	const focus = (node: globalThis.Element | null) => node instanceof HTMLElement && node.focus();

	const step = (delta: number) => {
		api.setHovered(-1);
		api.setValue(api.value + delta);
	};
</script>

<Element
	as="span"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="rating-group"
	data-part="item"
	data-slot="rating-group-item"
	class={cn(styles.item, className)}
	onpointerdown={(event) => {
		if (event.button !== 0) return;
		if (api.disabled) return;
		const target = event.currentTarget;
		if (!(target instanceof HTMLElement)) return;
		target.focus({ preventScroll: true });
	}}
	onpointermove={(event) => {
		if (api.disabled || api.readOnly) return;
		if (event.pointerType === 'touch') return;
		const target = event.currentTarget;
		if (!(target instanceof HTMLElement)) return;
		const { left, width } = target.getBoundingClientRect();
		const ratio = width ? (event.clientX - left) / width : 1;
		api.setHovered(ratio < 0.5 && index > 1 ? index - 0.5 : index);
	}}
	onclick={() => {
		api.setHovered(-1);
		api.setValue(index);
	}}
	onkeydown={(event) => {
		if (api.disabled || api.readOnly) return;
		const factor = api.value;
		switch (event.key) {
			case 'ArrowLeft':
			case 'ArrowUp':
				event.preventDefault();
				step(-(index > 1 ? 0.5 : 1));
				focus(document.getElementById(api.itemId(Math.max(1, Math.ceil(factor - 1)))));
				break;
			case 'ArrowRight':
			case 'ArrowDown':
				event.preventDefault();
				step(1);
				break;
			case 'Home':
				event.preventDefault();
				api.setValue(1);
				break;
			case 'End':
				event.preventDefault();
				api.setValue(api.count);
				break;
			case ' ':
				event.preventDefault();
				api.setValue(index);
				break;
		}
	}}
>
	{@render children?.()}
</Element>
