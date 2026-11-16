<script lang="ts">
	import {
		MenuItem,
		MenuItemShortcut
	} from '../../src/lib/components/menu/index.js';
	import {
		SplitButton,
		SplitButtonAction,
		SplitButtonContent,
		SplitButtonPositioner,
		SplitButtonTrigger
	} from '../../src/lib/components/split-button/index.js';

	let {
		actionDisabled = false,
		onAction = undefined,
		onOpenChange = undefined,
		onSelect = undefined,
		open = undefined,
		size = undefined,
		triggerDisabled = false,
		variant = undefined
	} = $props();
</script>

<SplitButton {onOpenChange} {onSelect} {open} {size} {variant} aria-label="Document">
	<SplitButtonAction onclick={onAction} disabled={actionDisabled}>Save</SplitButtonAction>
	<SplitButtonTrigger disabled={triggerDisabled} />
	<SplitButtonPositioner>
		<SplitButtonContent aria-label="Save options">
			<MenuItem value="save-as">
				Save as…
				<MenuItemShortcut>⇧⌘S</MenuItemShortcut>
			</MenuItem>
			<MenuItem value="export">Export</MenuItem>
			<MenuItem value="archive" disabled>Archive</MenuItem>
		</SplitButtonContent>
	</SplitButtonPositioner>
</SplitButton>
