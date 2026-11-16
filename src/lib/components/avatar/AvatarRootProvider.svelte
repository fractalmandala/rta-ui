<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { AvatarSize } from './Avatar.svelte';
	import type { AvatarApi } from './avatar.state.svelte';

	export interface AvatarRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: AvatarApi;
		size?: AvatarSize;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Avatar.module.css';
	import { setAvatarContext } from './avatar.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		size = 'md',
		value,
		...props
	}: AvatarRootProviderProps = $props();

	const api = untrack(() => value);
	setAvatarContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	data-scope="avatar"
	data-part="root"
	data-size={size}
	data-slot="avatar-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
