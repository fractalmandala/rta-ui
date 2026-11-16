<script module lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import type { MenuRootProps } from '../menu/Menu.svelte';
	import type { SplitButtonSize, SplitButtonVariant } from './context';

	export interface SplitButtonRootProps extends MenuRootProps {
		'aria-label'?: string;
		'aria-labelledby'?: string;
		class?: ClassValue;
		ref?: HTMLDivElement | null;
		size?: SplitButtonSize;
		variant?: SplitButtonVariant;
	}
</script>

<script lang="ts">
	import { cn } from '../../internal/cn.js';
	import Menu from '../menu/Menu.svelte';
	import { setSplitButtonContext } from './context';
	// Load Button defaults before the attached overrides across separate component modules.
	import '../button/Button.module.css';
	import styles from './SplitButton.module.css';

	let {
		'aria-label': ariaLabel = undefined,
		'aria-labelledby': ariaLabelledby = undefined,
		children,
		class: className,
		highlightedValue = $bindable(undefined),
		open = $bindable(undefined),
		positioning = undefined,
		ref = $bindable(null),
		size = 'md',
		triggerValue = $bindable(undefined),
		variant = 'default',
		...props
	}: SplitButtonRootProps = $props();

	setSplitButtonContext({ size: () => size, variant: () => variant });
</script>

<div
	bind:this={ref}
	role="group"
	aria-label={ariaLabel}
	aria-labelledby={ariaLabelledby}
	data-scope="split-button"
	data-part="root"
	data-slot="split-button-root"
	class={cn(styles.root, className)}
>
	<Menu
		{...props}
		bind:open
		bind:highlightedValue
		bind:triggerValue
		positioning={{ placement: 'bottom-end', gutter: 4, ...positioning }}
	>
		{@render children?.()}
	</Menu>
</div>
