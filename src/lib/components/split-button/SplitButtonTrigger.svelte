<script module lang="ts">
	import type { MenuTriggerProps } from '../menu/MenuTrigger.svelte';
	import type { SplitButtonSize, SplitButtonVariant } from './context';

	export interface SplitButtonTriggerProps extends Omit<MenuTriggerProps, 'asChild'> {
		size?: SplitButtonSize;
		variant?: SplitButtonVariant;
	}
</script>

<script lang="ts">
	import { cn } from '../../internal/cn.js';
	import { a11yLabels } from '../../internal/a11yLabels.js';
	import Button from '../button/Button.svelte';
	import MenuTrigger from '../menu/MenuTrigger.svelte';
	import { useSplitButtonContext } from './context';
	import styles from './SplitButton.module.css';

	let {
		children,
		class: className,
		ref = $bindable(null),
		size = undefined,
		variant = undefined,
		...props
	}: SplitButtonTriggerProps = $props();

	const context = useSplitButtonContext();
</script>

<MenuTrigger aria-label={children ? undefined : a11yLabels.moreActions} {...props} bind:ref>
	{#snippet asChild(triggerProps)}
		{@const merged = triggerProps({ class: cn(styles.trigger, className) }) as Record<
			string,
			unknown
		>}
		<Button
			{...merged}
			size={size ?? context.size()}
			variant={variant ?? context.variant()}
			data-slot="split-button-trigger"
		>
			{#if children}
				{@render children()}
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					focusable="false"
				><path d="m6 9 6 6 6-6" /></svg>
			{/if}
		</Button>
	{/snippet}
</MenuTrigger>
