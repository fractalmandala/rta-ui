<script module lang="ts">
	import type { CloseButtonProps } from '../close-button/CloseButton.svelte';

	export interface TagsInputClearTriggerProps extends CloseButtonProps {}
</script>

<script lang="ts">
	import { cn } from '../../internal/cn.js';
	import CloseButton from '../close-button/CloseButton.svelte';
	import styles from './TagsInput.module.css';
	import { useTagsInputContext } from './tags-input.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: TagsInputClearTriggerProps = $props();

	const api = useTagsInputContext();
	const attrs = $derived(api.clearTriggerAttrs());
</script>

<!-- Ark merges its label, anatomy, and state props onto the CloseButton host. -->
<CloseButton
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	class={cn(styles.clearTrigger, className)}
	data-scope="tags-input"
	data-part="clear-trigger"
	data-slot="tags-input-clear-trigger"
>
	{@render children?.()}
</CloseButton>
