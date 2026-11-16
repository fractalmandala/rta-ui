<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseClipboardProps } from './clipboard.state.svelte';

	export interface ClipboardRootProps
		extends UseClipboardProps, HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Clipboard.module.css';
	import { createClipboard, setClipboardContext } from './clipboard.state.svelte';

	let {
		asChild,
		children,
		class: className,
		defaultValue,
		id,
		onCopy,
		onValueChange,
		ref = $bindable(null),
		timeout,
		value = $bindable(),
		...props
	}: ClipboardRootProps = $props();

	const uid = $props.id();
	const api = createClipboard(
		() => ({
			defaultValue,
			id,
			onCopy,
			onValueChange(details) {
				onValueChange?.(details);
				value = details.value;
			},
			timeout,
			value
		}),
		uid
	);
	setClipboardContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="clipboard"
	data-part="root"
	data-slot="clipboard-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
