<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface DialogFooterProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Dialog.module.css';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: DialogFooterProps = $props();
</script>

<Element as="div" {...props} bind:ref {asChild} data-slot="dialog-footer" class={cn(styles.footer, className)}>
	{@render children?.()}
</Element>
