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
		MenuTriggerItem,
		MenuTriggerItemIcon,
		MenuViewport
	} from '../../src/lib/components/menu/index.js';

	let {
		closeOnSelect = undefined,
		defaultOpen = undefined,
		defaultHighlightedValue = undefined,
		dir = undefined,
		lazyMount = undefined,
		onHighlightChange = undefined,
		onOpenChange = undefined,
		onSelect = undefined,
		onTriggerValueChange = undefined,
		open = undefined,
		portalled = undefined,
		unmountOnExit = undefined
	} = $props();

	let wrap = $state(false);
</script>

<Menu
	{closeOnSelect}
	{defaultOpen}
	{defaultHighlightedValue}
	{dir}
	{lazyMount}
	{onHighlightChange}
	{onOpenChange}
	{onSelect}
	{onTriggerValueChange}
	{open}
	{portalled}
	{unmountOnExit}
>
	<MenuTrigger>
		Actions
		<MenuIndicator />
	</MenuTrigger>
	<MenuPositioner>
		<MenuContent aria-label="Actions">
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
				<MenuCheckboxItem value="locked" disabled indicator="end">
					<MenuItemText>Locked</MenuItemText>
					<MenuItemIndicator />
				</MenuCheckboxItem>
				<MenuRadioItemGroup value="compact">
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
				<Menu>
					<MenuTriggerItem>
						Share
						<MenuTriggerItemIcon />
					</MenuTriggerItem>
					<MenuPositioner>
						<MenuContent aria-label="Share">
							<MenuItem value="email">Email</MenuItem>
							<MenuItem value="slack">Slack</MenuItem>
						</MenuContent>
					</MenuPositioner>
				</Menu>
			</MenuViewport>
		</MenuContent>
	</MenuPositioner>
</Menu>
