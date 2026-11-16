<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface LightboxFooterProps
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
	}: LightboxFooterProps = $props();
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	data-scope="lightbox"
	data-part="footer"
	data-slot="lightbox-footer"
	class={cn(styles.footer, className)}
>
	{@render children?.()}
</Element>
