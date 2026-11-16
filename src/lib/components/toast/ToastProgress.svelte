<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ToastProgressProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute<HTMLDivElement> {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { useToastContext } from './toast.state.svelte';

	let { asChild, children, class: className, ref = $bindable(null), style, ...props }: ToastProgressProps =
		$props();

	const api = useToastContext();

	const trackStyle =
		'position: absolute; inset-block-end: 0; inset-inline: 0; height: var(--toast-progress-height, 2px); overflow: hidden; pointer-events: none;';
	const barStyle =
		'height: 100%; width: 100%; background-color: currentColor; opacity: 0.4; transform-origin: var(--toast-progress-origin, left); transition: transform 100ms linear;';
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	role="presentation"
	aria-hidden="true"
	data-scope="toast"
	data-part="progress"
	data-state={api.state}
	data-type={api.type}
	data-paused={dataAttr(api.paused)}
	data-slot="toast-progress"
	style={mergeStyleDeclarations(`${trackStyle} --progress: ${api.progress};`, style)}
	class={cn(className)}
>
	{#if children}
		{@render children()}
	{:else}
		<div data-slot="toast-progress-bar" style={`${barStyle} transform: scaleX(var(--progress));`}></div>
	{/if}
</Element>
