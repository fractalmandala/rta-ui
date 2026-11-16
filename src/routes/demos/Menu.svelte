<script lang="ts">
	import {
		Menu,
		MenuArrow,
		MenuCheckboxItem,
		MenuContent,
		MenuIndicator,
		MenuItem,
		MenuItemGroup,
		MenuItemGroupLabel,
		MenuItemIndicator,
		MenuItemShortcut,
		MenuItemText,
		MenuPositioner,
		MenuRadioItem,
		MenuRadioItemGroup,
		MenuSeparator,
		MenuTrigger,
		MenuViewport
	} from '../../lib/index';

	let wrap = $state(true);
	let density = $state('compact');
</script>

<Menu>
	<MenuTrigger>
		Actions
		<MenuIndicator />
	</MenuTrigger>
	<MenuPositioner>
		<MenuContent>
			<MenuArrow />
			<MenuViewport>
				<MenuItemGroup id="edit">
					<MenuItemGroupLabel htmlFor="edit">Edit</MenuItemGroupLabel>
					<MenuItem value="undo">
						<MenuItemText>Undo</MenuItemText>
						<MenuItemShortcut>⌘Z</MenuItemShortcut>
					</MenuItem>
					<MenuItem value="redo" disabled>
						<MenuItemText>Redo</MenuItemText>
					</MenuItem>
				</MenuItemGroup>
				<MenuSeparator />
				<MenuCheckboxItem value="wrap" bind:checked={wrap}>
					<MenuItemIndicator />
					<MenuItemText>Word wrap</MenuItemText>
				</MenuCheckboxItem>
				<MenuRadioItemGroup value={density} onValueChange={(details) => (density = details.value ?? 'compact')}>
					<MenuRadioItem value="compact">
						<MenuItemIndicator />
						<MenuItemText>Compact</MenuItemText>
					</MenuRadioItem>
					<MenuRadioItem value="comfortable">
						<MenuItemIndicator />
						<MenuItemText>Comfortable</MenuItemText>
					</MenuRadioItem>
				</MenuRadioItemGroup>
				<MenuSeparator />
				<MenuItem value="delete" tone="destructive">
					<MenuItemText>Delete</MenuItemText>
				</MenuItem>
			</MenuViewport>
		</MenuContent>
	</MenuPositioner>
</Menu>
