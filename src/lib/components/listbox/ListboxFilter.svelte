<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ListboxFilterProps
		extends HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import { cn } from '../../internal/cn.js';
	import styles from './Listbox.module.css';

	let { children, class: className, ref = $bindable(null), ...props }: ListboxFilterProps = $props();
</script>

<div {...props} bind:this={ref} class={cn(styles.filter, className)} data-slot="listbox-filter">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		focusable="false"
		data-slot="listbox-filter-icon"
		class={styles.filterIcon}
	>
		<circle cx="11" cy="11" r="8" />
		<path d="m21 21-4.3-4.3" />
	</svg>
	{@render children?.()}
</div>
