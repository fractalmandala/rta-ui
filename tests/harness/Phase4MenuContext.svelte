<script lang="ts">
	import {
		Menu,
		MenuContent,
		MenuContextTrigger,
		MenuItem,
		MenuPositioner,
		MenuSeparator
	} from '../../src/lib/components/menu/index.js';

	let { onOpenChange = undefined, onSelect = undefined } = $props();
</script>

<Menu {onOpenChange} {onSelect}>
	<MenuContextTrigger>Right click me</MenuContextTrigger>
	<MenuPositioner>
		<MenuContent aria-label="Canvas">
			<MenuItem value="copy">Copy</MenuItem>
			<MenuItem value="paste">Paste</MenuItem>
			<MenuSeparator />
			<MenuItem value="inspect">Inspect</MenuItem>
		</MenuContent>
	</MenuPositioner>
</Menu>
