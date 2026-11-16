<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { SelectControlProps } from './SelectControl.svelte';

	export interface SelectFieldProps extends Omit<SelectControlProps, 'asChild' | 'children'> {
		clearLabel?: string;
		indicator?: Snippet;
		placeholder?: string;
	}
</script>

<script lang="ts">
	import SelectClearTrigger from './SelectClearTrigger.svelte';
	import SelectControl from './SelectControl.svelte';
	import SelectIndicator from './SelectIndicator.svelte';
	import SelectTrigger from './SelectTrigger.svelte';
	import SelectValueText from './SelectValueText.svelte';

	let { clearLabel, indicator, placeholder, ref = $bindable(null), ...props }: SelectFieldProps =
		$props();
</script>

<SelectControl {...props} bind:ref>
	<SelectTrigger>
		<SelectValueText {placeholder} />
	</SelectTrigger>
	{#if clearLabel}
		<SelectClearTrigger aria-label={clearLabel} />
	{/if}
	<SelectIndicator children={indicator} />
</SelectControl>
