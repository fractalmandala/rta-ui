<script lang="ts">
	import type { CommandPaletteInputProps } from './CommandPaletteInput.svelte';
	import styles from './CommandPalette.module.css';
	import CommandPaletteClearTrigger from './CommandPaletteClearTrigger.svelte';
	import CommandPaletteControl from './CommandPaletteControl.svelte';
	import CommandPaletteInput from './CommandPaletteInput.svelte';
	import { useCommandPaletteComboboxContext } from './command-palette.state.svelte';

	let {
		ref = $bindable(null),
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		...props
	}: CommandPaletteInputProps = $props();

	const api = useCommandPaletteComboboxContext();
</script>

<CommandPaletteControl>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		focusable="false"
		data-slot="command-palette-search-icon"
		class={styles.searchIcon}
	>
		<circle cx="11" cy="11" r="8" />
		<path d="m21 21-4.3-4.3" />
	</svg>
	<CommandPaletteInput
		{...props}
		bind:ref
		aria-label={ariaLabel ?? (ariaLabelledby == null ? api.translations.searchLabel : undefined)}
		aria-labelledby={ariaLabelledby}
	/>
	<CommandPaletteClearTrigger />
</CommandPaletteControl>
