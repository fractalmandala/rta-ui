<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface CollapsibleContentProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import { createPanelMotion } from '../../internal/panel-motion.svelte.js';
	import styles from './Collapsible.module.css';
	import { useCollapsibleContext } from './collapsible.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), ...props }: CollapsibleContentProps =
		$props();

	const api = useCollapsibleContext();
	let node = $state<globalThis.Element | null>(null);

	const motion = createPanelMotion({
		getOpen: () => api.open,
		getNode: () => node as HTMLElement | null,
		getCollapsedHeight: () => api.collapsedHeight,
		getCollapsedWidth: () => api.collapsedWidth
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref={node}
	{asChild}
	id={api.contentId}
	dir={api.dir}
	hidden={motion.hidden}
	inert={motion.inert ? true : undefined}
	data-scope="collapsible"
	data-part="content"
	data-collapsible=""
	data-state={motion.suppressed ? undefined : motion.state}
	data-disabled={dataAttr(api.disabled)}
	data-has-collapsed-size={dataAttr(api.collapsedHeight != null || api.collapsedWidth != null)}
	data-slot="collapsible-content"
	class={cn(styles.content, className)}
>
	{@render children?.()}
</Element>
