<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseSplitterProps } from './splitter.state.svelte';

	export interface SplitterRootProps
		extends Omit<UseSplitterProps, 'size'>,
			HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		size?: Array<number | string>;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Splitter.module.css';
	import { createSplitter, setSplitterContext } from './splitter.state.svelte';

	let {
		asChild,
		children,
		class: className,
		defaultSize,
		dir,
		id,
		keyboardResizeBy,
		onCollapse,
		onExpand,
		onResize,
		onResizeEnd,
		onResizeStart,
		orientation,
		panels,
		ref = $bindable(null),
		size = $bindable(undefined),
		style,
		...props
	}: SplitterRootProps = $props();

	const uid = $props.id();
	const api = createSplitter(
		() => ({
			defaultSize,
			dir,
			id,
			keyboardResizeBy,
			onCollapse,
			onExpand,
			onResizeStart,
			onResizeEnd,
			orientation,
			panels,
			size,
			onResize: (details) => {
				size = details.size;
				onResize?.(details);
			}
		}),
		uid
	);
	setSplitterContext(api);

	// Ark sets inline width and height of 100%; clear them so consumer sizes and classes apply.
	const rootStyle = $derived(['width:', 'height:', style].filter(Boolean).join(';'));
	const attrs = $derived(api.rootAttrs());

	$effect(() => {
		api.registerRoot(ref);
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={rootStyle}
	bind:ref
	{asChild}
	data-scope="splitter"
	data-part="root"
	data-slot="splitter-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
