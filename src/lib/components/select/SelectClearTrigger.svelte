<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface SelectClearTriggerProps
		extends Omit<HTMLProps<'button'>, 'type'>,
			PolymorphicProps<'button'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import { CloseIcon } from '../../internal/icons/index.js';
	import styles from './Select.module.css';
	import { useSelectContext } from './select.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		...props
	}: SelectClearTriggerProps = $props();

	const api = useSelectContext();
	const attrs = $derived(api.clearTriggerAttrs());

	$effect(() => {
		api.registerClearTrigger(ref as HTMLElement | null);
	});

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
	{...attrs}
	aria-label={ariaLabel ?? (ariaLabelledBy == null ? api.clearTriggerLabel : undefined)}
	aria-labelledby={ariaLabelledBy}
	style={mergeStyleDeclarations(attrs.style ?? `${buttonStyle};`, props.style)}
	data-scope="select"
	data-part="clear-trigger"
	data-slot="select-clear-trigger"
	class={cn(styles.clearTrigger, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<CloseIcon width="16" height="16" />
	{/if}
</Element>
