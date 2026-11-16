<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { RefAttribute } from '../../internal/types';

	export interface RadioGroupOptionProps extends RefAttribute {
		value: string;
		disabled?: boolean;
		invalid?: boolean;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import RadioGroupItem from './RadioGroupItem.svelte';
	import RadioGroupItemControl from './RadioGroupItemControl.svelte';
	import RadioGroupItemHiddenInput from './RadioGroupItemHiddenInput.svelte';
	import RadioGroupItemText from './RadioGroupItemText.svelte';

	let {
		children,
		disabled,
		invalid,
		ref = $bindable(null),
		value
	}: RadioGroupOptionProps = $props();
</script>

<RadioGroupItem {value} {disabled} {invalid} bind:ref>
	<RadioGroupItemHiddenInput {value} {disabled} {invalid} />
	<RadioGroupItemControl {value} {disabled} {invalid} />
	<RadioGroupItemText {value} {disabled} {invalid}>{@render children?.()}</RadioGroupItemText>
</RadioGroupItem>
