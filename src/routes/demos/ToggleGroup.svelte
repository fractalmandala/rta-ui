<script lang="ts">
	import { ToggleGroup, ToggleGroupItem } from '../../lib/index';

	let value = $state(['left']);
</script>

<ToggleGroup bind:value>
	<ToggleGroupItem value="left">Left</ToggleGroupItem>
	<ToggleGroupItem value="center">Center</ToggleGroupItem>
	<ToggleGroupItem value="right">Right</ToggleGroupItem>
</ToggleGroup>
