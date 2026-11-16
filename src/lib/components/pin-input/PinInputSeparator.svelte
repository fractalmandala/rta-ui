<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	export interface PinInputSeparatorProps extends HTMLAttributes<HTMLSpanElement> {}
</script>

<script lang="ts">
	import { cn } from '../../internal/cn.js';
	import styles from './PinInput.module.css';

	let { children, class: className, ...props }: PinInputSeparatorProps = $props();
</script>

<span
	aria-hidden="true"
	{...props}
	data-scope="pin-input"
	data-part="separator"
	data-slot="pin-input-separator"
	class={cn(styles.separator, className)}
>
	{#if children}
		{@render children()}
	{:else}
		<svg viewBox="0 0 16 4" fill="none" aria-hidden="true" focusable="false">
			<path d="M1 2h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
		</svg>
	{/if}
</span>
