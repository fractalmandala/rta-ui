<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ListboxClearTriggerProps
		extends Omit<HTMLProps<'button'>, 'type'>,
			PolymorphicProps<'button'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import { CloseIcon } from '../../internal/icons/index.js';
	import { a11yLabels } from '../../internal/a11yLabels';
	import { useListboxContext } from './listbox.state.svelte';
	import styles from './Listbox.module.css';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		'aria-label': ariaLabel,
		onclick,
		...props
	}: ListboxClearTriggerProps = $props();

	const api = useListboxContext();

	// The close-button surface moduix composes in, kept inline because a component only imports
	// its own files.
	const buttonStyle = [
		'display: inline-flex',
		'align-items: center',
		'justify-content: center',
		'flex-shrink: 0',
		'width: var(--moduix-close-button-size, var(--moduix-spacing-7))',
		'height: var(--moduix-close-button-size, var(--moduix-spacing-7))',
		'margin: 0',
		'padding: 0',
		'border: none',
		'background-color: transparent',
		'border-radius: var(--moduix-radius-sm)',
		'color: var(--moduix-muted-foreground)',
		'appearance: none',
		'font: inherit',
		'user-select: none',
		'cursor: pointer'
	].join('; ');
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	type="button"
	aria-label={ariaLabel ?? a11yLabels.clearSearch}
	style={mergeStyleDeclarations(`${buttonStyle};`, props.style)}
	data-scope="listbox"
	data-part="clear-trigger"
	data-slot="listbox-clear-trigger"
	class={cn(styles.clearTrigger, className)}
	onclick={(event) => {
		onclick?.(event);
		if (!event.defaultPrevented) api.clearInput();
	}}
>
	{#if children}
		{@render children()}
	{:else}
		<CloseIcon width="16" height="16" />
	{/if}
</Element>
