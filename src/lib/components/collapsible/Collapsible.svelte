<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseCollapsibleProps } from './collapsible.state.svelte';

	export interface CollapsibleRootProps
		extends UseCollapsibleProps, HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Collapsible.module.css';
	import { createCollapsible, setCollapsibleContext } from './collapsible.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onOpenChange,
		open = $bindable(),
		ref = $bindable(null),
		...props
	}: CollapsibleRootProps = $props();

	const uid = $props.id();
	const api = createCollapsible(
		() => ({
			...props,
			open,
			onOpenChange(details) {
				onOpenChange?.(details);
				if (open !== undefined) open = details.open;
			}
		}),
		uid
	);
	setCollapsibleContext(api);
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.rootId}
	dir={api.dir}
	data-scope="collapsible"
	data-part="root"
	data-state={api.open ? 'open' : 'closed'}
	data-slot="collapsible-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
