<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ToastIconProps
		extends HTMLProps<'span'>,
			PolymorphicProps<'span'>,
			RefAttribute<HTMLSpanElement> {
		size?: number;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { CheckIcon, CloseIcon } from '../../internal/icons/index.js';
	import { useToastContext } from './toast.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		size = 16,
		style,
		...props
	}: ToastIconProps = $props();

	const api = useToastContext();
	const iconStyle =
		'display: inline-flex; flex: none; align-items: center; justify-content: center; line-height: 0;';
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	aria-hidden="true"
	data-scope="toast"
	data-part="icon"
	data-type={api.type}
	data-state={api.state}
	data-slot="toast-icon"
	style={mergeStyleDeclarations(iconStyle, style)}
	class={cn(className)}
>
	{#if children}
		{@render children()}
	{:else if api.type === 'success'}
		<CheckIcon width={size} height={size} strokeWidth={2} />
	{:else if api.type === 'error'}
		<CloseIcon width={size} height={size} strokeWidth={2} />
	{:else if api.type === 'warning'}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			focusable="false"
		>
			<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
			<path d="M12 9v4" />
			<path d="M12 17h.01" />
		</svg>
	{:else if api.type === 'loading'}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			focusable="false"
		>
			<path d="M21 12a9 9 0 1 1-6.219-8.56">
				<animateTransform
					attributeName="transform"
					type="rotate"
					from="0 12 12"
					to="360 12 12"
					dur="1s"
					repeatCount="indefinite"
				/>
			</path>
		</svg>
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			focusable="false"
		>
			<circle cx="12" cy="12" r="10" />
			<path d="M12 16v-4" />
			<path d="M12 8h.01" />
		</svg>
	{/if}
</Element>
