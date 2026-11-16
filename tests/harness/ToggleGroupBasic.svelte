<script lang="ts">
	import { ToggleGroup, ToggleGroupItem } from '../../src/lib/components/toggle-group/index.js';

	let {
		defaultValue = undefined,
		deselectable = undefined,
		disabled = undefined,
		multiple = undefined,
		onValueChange = undefined,
		orientation = undefined
	} = $props();
</script>

<ToggleGroup
	{defaultValue}
	{deselectable}
	{disabled}
	{multiple}
	{onValueChange}
	{orientation}
	aria-label="Text alignment"
>
	<ToggleGroupItem value="left">Left</ToggleGroupItem>
	<ToggleGroupItem value="center">Center</ToggleGroupItem>
	<ToggleGroupItem value="right" disabled>Right</ToggleGroupItem>
</ToggleGroup>
