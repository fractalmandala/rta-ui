<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface AvatarFallbackProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Avatar.module.css';
	import { useAvatarContext } from './avatar.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: AvatarFallbackProps = $props();

	const api = useAvatarContext();
	const attrs = $derived(api.fallbackAttrs());
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="avatar"
	data-part="fallback"
	data-slot="avatar-fallback"
	class={cn(styles.fallback, className)}
>
	{@render children?.()}
</Element>
