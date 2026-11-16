<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ComboboxClearTriggerProps
		extends Omit<HTMLProps<'button'>, 'type'>,
			PolymorphicProps<'button'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { CloseIcon } from '../../internal/icons/index.js';
	import CloseButton from '../close-button/CloseButton.svelte';
	import styles from './Combobox.module.css';
	import { useComboboxContext } from './combobox.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ComboboxClearTriggerProps = $props();

	const api = useComboboxContext();
	const attrs = $derived(api.clearTriggerAttrs());
	const label = $derived(
		(props['aria-label'] as string | undefined) ??
			(attrs['aria-label'] as string | undefined) ??
			api.translations.clearTriggerLabel
	);
</script>

{#if asChild}
	<Element
		as="button"
		{...props}
		bind:ref
		{asChild}
		{...attrs}
		style={mergeStyleDeclarations(attrs.style, props.style)}
		data-scope="combobox"
		data-part="clear-trigger"
		data-slot="combobox-clear-trigger"
		class={cn(styles.clearTrigger, className)}
	>
		{@render children?.()}
	</Element>
{:else}
	<CloseButton
		{...props}
		{...attrs}
		bind:ref
		aria-label={label}
		data-scope="combobox"
		data-part="clear-trigger"
		data-slot="combobox-clear-trigger"
		class={cn(styles.clearTrigger, className)}
	>
		{#if children}
			{@render children()}
		{:else}
			<CloseIcon />
		{/if}
	</CloseButton>
{/if}
