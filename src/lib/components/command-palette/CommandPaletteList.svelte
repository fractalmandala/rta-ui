<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CommandPaletteListProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './CommandPalette.module.css';
	import { useCommandPaletteComboboxContext } from './command-palette.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: CommandPaletteListProps = $props();

	const api = useCommandPaletteComboboxContext();
	const attrs = $derived(api.contentAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="command-palette"
	data-part="list"
	data-slot="command-palette-list"
	class={cn(styles.list, className)}
>
	<div class={styles.scrollArea} style="display: flex; min-height: 0;">
		<div class={styles.scrollViewport} style="width: 100%; height: 100%; min-height: 0; overflow: auto;">
			<div class={styles.scrollContent}>
				{@render children?.()}
			</div>
		</div>
	</div>
</Element>
