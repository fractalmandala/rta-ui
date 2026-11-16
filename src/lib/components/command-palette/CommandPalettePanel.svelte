<script lang="ts">
	import type { CommandPaletteContentProps } from './CommandPaletteContent.svelte';
	import CommandPaletteBackdrop from './CommandPaletteBackdrop.svelte';
	import CommandPaletteContent from './CommandPaletteContent.svelte';
	import CommandPalettePositioner from './CommandPalettePositioner.svelte';

	let { ref = $bindable(null), ...props }: CommandPaletteContentProps = $props();
</script>

<CommandPaletteBackdrop />
<CommandPalettePositioner>
	<CommandPaletteContent {...props} bind:ref />
</CommandPalettePositioner>
