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
		CommandPaletteItemIndicator,
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
	} from '../../src/lib/components/command-palette/index';

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
			value: 'notes',
			label: 'Release notes',
			section: 'System',
			description: 'Read the latest product changes',
			icon: '↗'
		}
	];

	let {
		open = $bindable(false),
		shortcut = undefined as undefined | false | string,
		closeOnSelect = true,
		value = $bindable([] as string[]),
		onSelect,
		onOpenChange,
		onValueChange
	}: {
		open?: boolean;
		shortcut?: false | string;
		closeOnSelect?: boolean;
		value?: string[];
		onSelect?: (details: { itemValue: string; value: string[] }) => void;
		onOpenChange?: (details: { open: boolean; reason: string }) => void;
		onValueChange?: (details: { value: string[] }) => void;
	} = $props();

	let query = $state('');
	let executed = $state<string[]>([]);

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

	function handleOpenChange(details: { open: boolean; reason: string }) {
		if (!details.open) query = '';
		onOpenChange?.(details);
	}
</script>

<CommandPalette
	aria-label="Command palette"
	bind:open
	{shortcut}
	onOpenChange={handleOpenChange}
	closeOnEscape={true}
>
	<CommandPaletteTrigger>Open palette</CommandPaletteTrigger>
	<CommandPalettePanel>
		<CommandPaletteCombobox
			{closeOnSelect}
			items={filtered}
			inputValue={query}
			bind:value
			onInputValueChange={(details) => {
				query = details.inputValue;
			}}
			onSelect={(details) => {
				executed = [...executed, details.itemValue];
				onSelect?.({ itemValue: details.itemValue, value: details.value });
			}}
			onValueChange={(details) => onValueChange?.({ value: details.value })}
		>
			<CommandPaletteHeader>
				<CommandPaletteTitle>Commands</CommandPaletteTitle>
			</CommandPaletteHeader>
			<CommandPaletteSearch placeholder="Search commands, pages, and settings" />
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
								<CommandPaletteItemIndicator />
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

<p data-testid="executed">{executed.join(',')}</p>
