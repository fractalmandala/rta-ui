<script lang="ts">
	import { Toggle, ToggleIndicator } from '../../src/lib/components/toggle/index.js';

	let {
		defaultPressed = undefined,
		disabled = undefined,
		onPressedChange = undefined,
		pressed = undefined
	} = $props();
</script>

<Toggle
	{pressed}
	{defaultPressed}
	{disabled}
	{onPressedChange}
	size="sm"
	variant="outline"
	aria-label="Bold"
>
	Bold
	<ToggleIndicator>!</ToggleIndicator>
</Toggle>
