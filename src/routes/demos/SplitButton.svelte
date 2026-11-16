<script lang="ts">
	import {
		MenuItem,
		MenuItemShortcut,
		SplitButton,
		SplitButtonAction,
		SplitButtonContent,
		SplitButtonPositioner,
		SplitButtonTrigger
	} from '../../lib/index';
</script>

<SplitButton variant="outline" aria-label="Document">
	<SplitButtonAction>Save</SplitButtonAction>
	<SplitButtonTrigger />
	<SplitButtonPositioner>
		<SplitButtonContent>
			<MenuItem value="save-as">
				Save as…
				<MenuItemShortcut>⇧⌘S</MenuItemShortcut>
			</MenuItem>
			<MenuItem value="export">Export</MenuItem>
			<MenuItem value="archive" disabled>Archive</MenuItem>
		</SplitButtonContent>
	</SplitButtonPositioner>
</SplitButton>
