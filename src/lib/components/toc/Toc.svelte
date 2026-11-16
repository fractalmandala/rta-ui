<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseTocProps } from './toc.state.svelte';

	export interface TocRootProps
		extends UseTocProps, HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Toc.module.css';
	import { createToc, setTocContext } from './toc.state.svelte';

	let {
		activeIds = $bindable(),
		asChild,
		autoScroll = false,
		children,
		class: className,
		defaultActiveIds,
		dir,
		getRootNode,
		id,
		ids,
		items,
		multiple,
		onActiveChange,
		ref = $bindable(null),
		rootMargin,
		scrollBehavior,
		scrollEl,
		threshold,
		...props
	}: TocRootProps = $props();

	const uid = $props.id();
	const api = createToc(
		() => ({
			activeIds,
			autoScroll,
			defaultActiveIds,
			dir,
			getRootNode,
			id,
			ids,
			items,
			multiple,
			onActiveChange(details) {
				onActiveChange?.(details);
				activeIds = details.activeIds;
			},
			rootMargin,
			scrollBehavior,
			scrollEl,
			threshold
		}),
		uid
	);
	setTocContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="toc"
	data-part="root"
	data-slot="toc-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
