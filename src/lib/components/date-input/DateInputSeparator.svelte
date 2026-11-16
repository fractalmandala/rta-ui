<script module lang="ts">
	import type { HTMLProps } from '../../internal/types';

	export interface DateInputSeparatorProps extends HTMLProps<'span'> {}
</script>

<script lang="ts">
	import { cn } from '../../internal/cn.js';
	import styles from './DateInput.module.css';

	let { children, class: className, ...props }: DateInputSeparatorProps = $props();
</script>

<span aria-hidden="true" {...props} class={cn(styles.separator, className)} data-slot="date-input-separator">
	{@render children?.()}
</span>
