<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseScrollAreaProps } from './scroll-area.state.svelte';

	export type ScrollAreaVariant = 'hover' | 'always';

	export interface ScrollAreaRootProps
		extends UseScrollAreaProps,
			HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		fade?: boolean;
		variant?: ScrollAreaVariant;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './ScrollArea.module.css';
	import { createScrollArea, setScrollAreaContext } from './scroll-area.state.svelte';

	let {
		asChild,
		children,
		class: className,
		dir,
		fade = false,
		getRootNode,
		id,
		ids,
		ref = $bindable(null),
		variant = 'hover',
		...props
	}: ScrollAreaRootProps = $props();

	const providedId = $props.id();
	const api = createScrollArea(
		() => ({ dir, getRootNode, id: id ?? providedId, ids }),
		providedId
	);
	setScrollAreaContext(api);
	const attrs = $derived(api.rootAttrs());

	$effect(() => {
		const node = ref as HTMLElement | null;
		if (!node) return;

		const win = node.ownerDocument.defaultView;
		let frame = 0;
		const run = () => {
			if (frame) win?.cancelAnimationFrame(frame);
			frame = win?.requestAnimationFrame(() => {
				frame = 0;
				api.measure();
			}) ?? 0;
		};

		run();
		const observer = win?.ResizeObserver ? new win.ResizeObserver(run) : null;
		observer?.observe(node);
		win?.addEventListener('resize', run);

		return () => {
			observer?.disconnect();
			win?.removeEventListener('resize', run);
			if (frame) win?.cancelAnimationFrame(frame);
		};
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="scroll-area"
	data-part="root"
	data-slot="scroll-area-root"
	data-fade={fade ? '' : undefined}
	data-variant={variant}
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
