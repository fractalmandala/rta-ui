<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface LightboxHeaderProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Lightbox.module.css';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: LightboxHeaderProps = $props();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	data-scope="lightbox"
	data-part="header"
	data-slot="lightbox-header"
	class={cn(styles.header, className)}
>
	{@render children?.()}
</Element>
