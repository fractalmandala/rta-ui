<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DatePickerPositionerProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import Portal from '../../internal/Portal.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './DatePicker.module.css';
	import { useDatePickerContext } from './date-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		style,
		...props
	}: DatePickerPositionerProps = $props();

	const api = useDatePickerContext();
	const attrs = $derived(api.getPositionerProps());

	$effect(() => {
		const element = ref as HTMLElement | null;
		api.setPositionerNode(element);
		return () => api.setPositionerNode(null);
	});
</script>

{#if api.present}
	<Portal to={api.portalTarget} disabled={!api.portalled}>
		<Element
			as="div"
			{...props}
			{...attrs}
			bind:ref
			{asChild}
			style={mergeStyleDeclarations(attrs.style as string | undefined, style)}
			data-scope="date-picker"
			data-part="positioner"
			data-slot="date-picker-positioner"
			class={cn(styles.positioner, className)}
		>
			{@render children?.()}
		</Element>
	</Portal>
{/if}
