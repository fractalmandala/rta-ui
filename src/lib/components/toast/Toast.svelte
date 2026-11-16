<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ToastRootProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute<HTMLDivElement> {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Toast.module.css';
	import { useToastContext } from './toast.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onkeydown,
		ref = $bindable(null),
		style,
		...props
	}: ToastRootProps = $props();

	const api = useToastContext();

	$effect(() => {
		api.setRootNode(ref as HTMLElement | null);
		return () => api.setRootNode(null);
	});
</script>

{#if api.present}
	<Element
		as="div"
		{...props}
		bind:ref
		{asChild}
		id={api.rootId}
		dir={api.dir}
		role="status"
		aria-atomic="true"
		aria-labelledby={api.ariaLabelledby}
		aria-describedby={api.ariaDescribedby}
		tabindex={0}
		data-scope="toast"
		data-part="root"
		data-state={api.state}
		data-type={api.type}
		data-placement={api.placement}
		data-align={api.align}
		data-side={api.side}
		data-mounted={dataAttr(api.mounted)}
		data-paused={dataAttr(api.paused)}
		data-first={dataAttr(api.frontmost)}
		data-sibling={dataAttr(!api.frontmost)}
		data-front={dataAttr(api.frontmost)}
		data-behind={dataAttr(!api.frontmost)}
		data-stack={dataAttr(api.stacked)}
		data-overlap={dataAttr(!api.stacked)}
		data-slot="toast-root"
		style={mergeStyleDeclarations(api.rootStyle, style)}
		onkeydown={(event) => {
			onkeydown?.(event);
			if (event.defaultPrevented) return;
			if (event.key !== 'Escape') return;
			event.preventDefault();
			api.dismiss('keyboard');
		}}
		class={cn(styles.root, className)}
	>
		<div data-ghost="before" style={api.ghostBeforeStyle}></div>
		{@render children?.()}
		<div data-ghost="after" style={api.ghostAfterStyle}></div>
	</Element>
{/if}
