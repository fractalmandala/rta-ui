<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ColorPickerContentProps
		extends Omit<HTMLProps<'div'>, 'role'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './ColorPicker.module.css';
	import { useColorPickerContext } from './color-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ColorPickerContentProps = $props();

	const api = useColorPickerContext();

	$effect(() => {
		api.setContentNode(ref as HTMLElement | null);
		return () => api.setContentNode(null);
	});
</script>

{#if api.present}
	<Element
		as="div"
		{...props}
		bind:ref
		{asChild}
		id={api.contentId}
		dir={api.dir}
		role={api.inline ? undefined : 'dialog'}
		tabindex={-1}
		hidden={!api.open}
		data-scope="color-picker"
		data-part="content"
		data-placement={api.placement}
		data-side={api.side}
		data-state={api.open ? 'open' : 'closed'}
		data-slot="color-picker-content"
		class={cn(styles.content, className)}
	>
		{@render children?.()}
	</Element>
{/if}
