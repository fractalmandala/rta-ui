<script lang="ts">
	import {
		Combobox,
		ComboboxClearTrigger,
		ComboboxContent,
		ComboboxControl,
		ComboboxEmpty,
		ComboboxInput,
		ComboboxItemGroup,
		ComboboxItemGroupLabel,
		ComboboxLabel,
		ComboboxList,
		ComboboxOption,
		ComboboxPositioner,
		ComboboxTrigger,
		type ComboboxEntry
	} from '../../lib/components/combobox/index';

	const fruits: ComboboxEntry[] = [
		{ value: 'apple', label: 'Apple', group: 'Orchard' },
		{ value: 'banana', label: 'Banana', group: 'Tropical' },
		{ value: 'mango', label: 'Mango', group: 'Tropical' },
		{ value: 'papaya', label: 'Papaya', group: 'Tropical' },
		{ value: 'pear', label: 'Pear', group: 'Orchard' }
	];

	let query = $state('');
	let multiQuery = $state('');
	let value = $state<string[]>([]);
	let multiValue = $state<string[]>(['mango']);

	const matches = (item: ComboboxEntry, value: string) =>
		String(item.label ?? item.value)
			.toLowerCase()
			.includes(value.toLowerCase());

	const filtered = $derived(query ? fruits.filter((item) => matches(item, query)) : fruits);

	const grouped = $derived(
		filtered.reduce<Record<string, ComboboxEntry[]>>((acc, item) => {
			const key = String(item.group ?? 'Other');
			(acc[key] ??= []).push(item);
			return acc;
		}, {})
	);

	const multiFiltered = $derived(multiQuery ? fruits.filter((item) => matches(item, multiQuery)) : fruits);
	const selected = $derived(fruits.filter((item) => multiValue.includes(item.value)));
</script>

<Combobox
	bind:value
	items={filtered}
	onInputValueChange={(details) => (query = details.inputValue)}
>
	<ComboboxLabel>Fruit</ComboboxLabel>
	<ComboboxControl>
		<ComboboxInput placeholder="e.g. Mango" />
		<ComboboxClearTrigger />
		<ComboboxTrigger />
	</ComboboxControl>
	<ComboboxPositioner>
		<ComboboxContent>
			<ComboboxEmpty>No fruits found.</ComboboxEmpty>
			{#each Object.entries(grouped) as [group, entries] (group)}
				<ComboboxItemGroup id={group}>
					<ComboboxItemGroupLabel>{group}</ComboboxItemGroupLabel>
					{#each entries as item (item.value)}
						<ComboboxOption {item}>{item.label}</ComboboxOption>
					{/each}
				</ComboboxItemGroup>
			{/each}
		</ComboboxContent>
	</ComboboxPositioner>
</Combobox>

<Combobox
	bind:value={multiValue}
	items={fruits}
	multiple
	onInputValueChange={(details) => (multiQuery = details.inputValue)}
>
	<ComboboxLabel>Fruits</ComboboxLabel>
	<p>
		{#if selected.length === 0}
			None selected
		{:else}
			{#each selected as item (item.value)}
				<span>{item.label}{' '}</span>
			{/each}
		{/if}
	</p>
	<ComboboxControl>
		<ComboboxInput placeholder="Search fruits" />
		<ComboboxTrigger />
	</ComboboxControl>
	<ComboboxPositioner>
		<ComboboxContent>
			<ComboboxEmpty>No fruits found.</ComboboxEmpty>
			<ComboboxList>
				{#each multiFiltered as item (item.value)}
					<ComboboxOption {item}>{item.label}</ComboboxOption>
				{/each}
			</ComboboxList>
		</ComboboxContent>
	</ComboboxPositioner>
</Combobox>
