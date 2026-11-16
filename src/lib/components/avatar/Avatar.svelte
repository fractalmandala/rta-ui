<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseAvatarProps } from './avatar.state.svelte';

	export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

	export interface AvatarRootProps
		extends UseAvatarProps, HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		size?: AvatarSize;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Avatar.module.css';
	import { createAvatar, setAvatarContext } from './avatar.state.svelte';

	let {
		asChild,
		children,
		class: className,
		dir,
		id,
		ids,
		onStatusChange,
		ref = $bindable(null),
		size = 'md',
		...props
	}: AvatarRootProps = $props();

	const uid = $props.id();
	const api = createAvatar(() => ({ dir, id, ids, onStatusChange }), uid);
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
	data-slot="avatar-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
