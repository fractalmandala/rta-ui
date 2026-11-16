<script lang="ts">
	import { Checkbox, CheckboxControl, CheckboxLabel } from '../../lib/index';

	let checked = $state(false);
	let indeterminate = $state(true);
</script>

<Checkbox bind:checked>
	<CheckboxControl />
	<CheckboxLabel>Accept terms</CheckboxLabel>
</Checkbox>
<Checkbox bind:checked={indeterminate} defaultChecked={false}>
	<CheckboxControl />
	<CheckboxLabel>Select all</CheckboxLabel>
</Checkbox>
