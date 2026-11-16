<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface AvatarImageProps
		extends HTMLProps<'img'>, PolymorphicProps<'img'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Avatar.module.css';
	import { useAvatarContext } from './avatar.state.svelte';

	let {
		asChild,
		class: className,
		ref = $bindable(null),
		...props
	}: AvatarImageProps = $props();

	const api = useAvatarContext();
	const attrs = $derived(api.imageAttrs());
</script>

<Element
	as="img"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="avatar"
	data-part="image"
	data-slot="avatar-image"
	onload={() => api.setLoaded()}
	onerror={() => api.setError()}
	class={cn(styles.image, className)}
/>
