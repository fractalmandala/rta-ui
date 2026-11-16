<script lang="ts">
	import {
		Checkbox,
		CheckboxControl,
		CheckboxGroup,
		CheckboxHiddenInput,
		CheckboxLabel
	} from '../../src/lib/components/checkbox/index.js';

	let {
		checked = undefined,
		defaultChecked = undefined,
		disabled = undefined,
		groupValue = undefined,
		indeterminate = undefined,
		onCheckedChange = undefined,
		onValueChange = undefined
	} = $props();
</script>

{#if groupValue}
	<CheckboxGroup value={groupValue} {onValueChange}>
		<Checkbox value="a">
			<CheckboxControl />
			<CheckboxLabel>Option A</CheckboxLabel>
			<CheckboxHiddenInput />
		</Checkbox>
		<Checkbox value="b">
			<CheckboxControl />
			<CheckboxLabel>Option B</CheckboxLabel>
			<CheckboxHiddenInput />
		</Checkbox>
	</CheckboxGroup>
{:else}
	<Checkbox {checked} {defaultChecked} {disabled} {indeterminate} {onCheckedChange} aria-label="Accept terms">
		<CheckboxControl />
		<CheckboxLabel>Accept terms</CheckboxLabel>
		<CheckboxHiddenInput />
	</Checkbox>
{/if}
