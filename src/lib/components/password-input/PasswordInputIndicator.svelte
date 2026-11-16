<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface PasswordInputIndicatorProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {
		/** The fallback content to display when the password is not visible. */
		fallback?: Snippet;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './PasswordInput.module.css';
	import { usePasswordInputContext } from './password-input.state.svelte';

	let {
		asChild,
		children,
		class: className,
		fallback,
		ref = $bindable(null),
		...props
	}: PasswordInputIndicatorProps = $props();

	const api = usePasswordInputContext();
	const attrs = $derived(api.indicatorAttrs());
</script>

{#snippet eyeVisible()}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		focusable="false"
	>
		<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
		<circle cx="12" cy="12" r="3" />
	</svg>
{/snippet}

{#snippet eyeHidden()}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		focusable="false"
	>
		<path d="m15 18-.722-3.25" />
		<path d="M2 8a10.645 10.645 0 0 0 20 0" />
		<path d="m20 15-1.726-2.05" />
		<path d="m4 15 1.726-2.05" />
		<path d="m9 18 .722-3.25" />
	</svg>
{/snippet}

<Element
	as="span"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="password-input"
	data-part="indicator"
	data-slot="password-input-indicator"
	class={cn(styles.indicator, className)}
>
	{#if api.visible}
		{#if children}
			{@render children()}
		{:else}
			{@render eyeVisible()}
		{/if}
	{:else}
		{#if fallback}
			{@render fallback()}
		{:else}
			{@render eyeHidden()}
		{/if}
	{/if}
</Element>
