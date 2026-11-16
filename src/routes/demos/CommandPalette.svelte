<script lang="ts">
	import {
		CommandPalette,
		CommandPaletteCombobox,
		CommandPaletteEmpty,
		CommandPaletteFooter,
		CommandPaletteHeader,
		CommandPaletteItem,
		CommandPaletteItemDescription,
		CommandPaletteItemGroup,
		CommandPaletteItemGroupLabel,
		CommandPaletteItemIcon,
		CommandPaletteItemLabel,
		CommandPaletteItemMeta,
		CommandPaletteItemText,
		CommandPaletteKbd,
		CommandPaletteList,
		CommandPalettePanel,
		CommandPaletteSearch,
		CommandPaletteTitle,
		CommandPaletteTrigger,
		type CommandPaletteEntry
	} from '../../lib/components/command-palette/index';

	interface Command extends CommandPaletteEntry {
		label: string;
		section: string;
		description: string;
		icon: string;
		shortcut?: string;
	}

	const commands: Command[] = [
		{
			value: 'new-project',
			label: 'New project',
			section: 'Create',
			description: 'Start a blank workspace',
			icon: '+',
			shortcut: 'N'
		},
		{
			value: 'invite-team',
			label: 'Invite teammates',
			section: 'Create',
			description: 'Send access to the current organization',
			icon: '+',
			shortcut: 'I'
		},
		{
			value: 'recent',
			label: 'Open recent work',
			section: 'Navigate',
			description: 'Jump back to a recently edited file',
			icon: '↗',
			shortcut: 'R'
		},
		{
			value: 'favorites',
			label: 'View favorites',
			section: 'Navigate',
			description: 'Show pinned dashboards and docs',
			icon: '★',
			shortcut: 'F'
		},
		{
			value: 'notes',
			label: 'Release notes',
			section: 'System',
			description: 'Read the latest product changes',
			icon: '↗'
		}
	];

	let query = $state('');
	let lastRun = $state('nothing yet');

	const filtered = $derived(
		commands.filter((item) =>
			`${item.label} ${item.description} ${item.section}`
				.toLowerCase()
				.includes(query.trim().toLowerCase())
		)
	);

	const groups = $derived.by(() => {
		const result: [string, Command[]][] = [];
		for (const item of filtered) {
			const group = result.find(([section]) => section === item.section);
			if (group) group[1].push(item);
			else result.push([item.section, [item]]);
		}
		return result;
	});
</script>

<CommandPalette
	aria-label="Command palette"
	shortcut="mod+k"
	onOpenChange={(details) => {
		if (!details.open) query = '';
	}}
>
	<CommandPaletteTrigger>Open palette</CommandPaletteTrigger>
	<CommandPalettePanel>
		<CommandPaletteCombobox
			items={filtered}
			inputValue={query}
			onInputValueChange={(details) => (query = details.inputValue)}
			onSelect={(details) => (lastRun = details.itemValue)}
		>
			<CommandPaletteHeader>
				<CommandPaletteTitle>Commands</CommandPaletteTitle>
			</CommandPaletteHeader>
			<CommandPaletteSearch placeholder="Search commands, pages, and settings…" />
			<CommandPaletteList>
				<CommandPaletteEmpty>No commands found.</CommandPaletteEmpty>
				{#each groups as [section, entries] (section)}
					<CommandPaletteItemGroup id={section}>
						<CommandPaletteItemGroupLabel>{section}</CommandPaletteItemGroupLabel>
						{#each entries as item (item.value)}
							<CommandPaletteItem {item}>
								<CommandPaletteItemIcon>{item.icon}</CommandPaletteItemIcon>
								<CommandPaletteItemText>
									<CommandPaletteItemLabel>{item.label}</CommandPaletteItemLabel>
									<CommandPaletteItemDescription>{item.description}</CommandPaletteItemDescription>
								</CommandPaletteItemText>
								{#if item.shortcut}
									<CommandPaletteItemMeta>{item.shortcut}</CommandPaletteItemMeta>
								{/if}
							</CommandPaletteItem>
						{/each}
					</CommandPaletteItemGroup>
				{/each}
			</CommandPaletteList>
			<CommandPaletteFooter>
				<span><CommandPaletteKbd>Enter</CommandPaletteKbd> run</span>
				<span><CommandPaletteKbd>Esc</CommandPaletteKbd> close</span>
			</CommandPaletteFooter>
		</CommandPaletteCombobox>
	</CommandPalettePanel>
</CommandPalette>

<p>Last command: {lastRun}. Press <CommandPaletteKbd>⌘</CommandPaletteKbd> <CommandPaletteKbd>K</CommandPaletteKbd> to open the palette.</p>
