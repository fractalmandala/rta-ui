<script lang="ts">
	import {
		Switch,
		SwitchControl,
		SwitchHiddenInput,
		SwitchLabel
	} from '../../src/lib/components/switch/index.js';

	let {
		checked = undefined,
		defaultChecked = undefined,
		disabled = undefined,
		readOnly = undefined,
		size = undefined,
		onCheckedChange = undefined
	} = $props();
</script>

<Switch
	{checked}
	{defaultChecked}
	{disabled}
	{readOnly}
	{size}
	{onCheckedChange}
	aria-label="Airplane mode"
>
	<SwitchControl />
	<SwitchLabel>Airplane mode</SwitchLabel>
	<SwitchHiddenInput />
</Switch>
