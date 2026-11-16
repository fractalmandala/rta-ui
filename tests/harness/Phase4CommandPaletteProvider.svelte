<script lang="ts">
	import {
		CommandPaletteCombobox,
		CommandPaletteEmpty,
		CommandPaletteItem,
		CommandPaletteItemLabel,
		CommandPaletteList,
		CommandPalettePanel,
		CommandPaletteRootProvider,
		CommandPaletteSearch,
		CommandPaletteTrigger,
		createCommandPalette,
		type CommandPaletteEntry
	} from '../../src/lib/components/command-palette/index';

	const items: CommandPaletteEntry[] = [
		{ value: 'save', label: 'Save file' },
		{ value: 'rename', label: 'Rename file' }
	];

	let query = $state('');
	let executed = $state('');

	const uid = $props.id();

	const api = createCommandPalette(
		() => ({
			'aria-label': 'Commands',
			shortcut: 'mod+k'
		}),
		uid
	);

	const filtered = $derived(
		items.filter((item) =>
			String(item.label ?? item.value)
				.toLowerCase()
				.includes(query.toLowerCase())
		)
	);
</script>

<CommandPaletteRootProvider value={api}>
	<CommandPaletteTrigger>Open commands</CommandPaletteTrigger>
	<CommandPalettePanel>
		<CommandPaletteCombobox
			items={filtered}
			inputValue={query}
			onInputValueChange={(details) => (query = details.inputValue)}
			onSelect={(details) => (executed = details.itemValue)}
		>
			<CommandPaletteSearch placeholder="Search" />
			<CommandPaletteList>
				<CommandPaletteEmpty>Nothing here.</CommandPaletteEmpty>
				{#each filtered as item (item.value)}
					<CommandPaletteItem {item}>
						<CommandPaletteItemLabel>{item.label}</CommandPaletteItemLabel>
					</CommandPaletteItem>
				{/each}
			</CommandPaletteList>
		</CommandPaletteCombobox>
	</CommandPalettePanel>
</CommandPaletteRootProvider>

<p data-testid="api-open">{api.open}</p>
<p data-testid="api-state">{api.state}</p>
<p data-testid="executed">{executed}</p>
<button type="button" data-testid="api-open-button" onclick={() => api.setOpen(true, 'script')}>
	Open from the api
</button>
