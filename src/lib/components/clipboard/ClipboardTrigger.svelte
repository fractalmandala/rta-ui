<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ClipboardTriggerProps
		extends Omit<HTMLProps<'button'>, 'type'>, PolymorphicProps<'button'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Clipboard.module.css';
	import { useClipboardContext } from './clipboard.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ClipboardTriggerProps = $props();

	const api = useClipboardContext();
	const attrs = $derived(api.triggerAttrs());
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="clipboard"
	data-part="trigger"
	data-slot="clipboard-trigger"
	class={cn(!asChild && styles.trigger, className)}
>
	{@render children?.()}
</Element>
