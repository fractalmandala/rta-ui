<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DateInputControlBaseProps
		extends PolymorphicProps<'div'>,
			RefAttribute {}

	export interface DateInputControlProps extends DateInputControlBaseProps, HTMLProps<'div'> {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './DateInput.module.css';
	import { useDateInputContext } from './date-input.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		style,
		...props
	}: DateInputControlProps = $props();

	const api = useDateInputContext();
	const attrs = $derived(api.getControlProps());

	$effect(() => {
		const element = ref as HTMLElement | null;
		api.setControlNode(element);
		return () => api.setControlNode(null);
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	style={mergeStyleDeclarations(attrs.style as string | undefined, style)}
	data-scope="date-input"
	data-part="control"
	data-slot="date-input-control"
	class={cn(styles.control, className)}
>
	{@render children?.()}
</Element>
