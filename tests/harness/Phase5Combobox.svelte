<script lang="ts">
	import {
		Combobox,
		ComboboxClearTrigger,
		ComboboxContent,
		ComboboxControl,
		ComboboxEmpty,
		ComboboxInput,
		ComboboxItem,
		ComboboxItemGroup,
		ComboboxItemGroupLabel,
		ComboboxItemIndicator,
		ComboboxItemText,
		ComboboxLabel,
		ComboboxList,
		ComboboxOption,
		ComboboxPositioner,
		ComboboxTrigger,
		type ComboboxEntry
	} from '../../src/lib/components/combobox/index';

	const allFruits: ComboboxEntry[] = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'mango', label: 'Mango' },
		{ value: 'papaya', label: 'Papaya' },
		{ value: 'kiwi', label: 'Kiwi', disabled: true }
	];

	const allCountries: ComboboxEntry[] = [
		{ value: 'ca', label: 'Canada', continent: 'North America' },
		{ value: 'us', label: 'United States', continent: 'North America' },
		{ value: 'de', label: 'Germany', continent: 'Europe' },
		{ value: 'fr', label: 'France', continent: 'Europe' }
	];

	let {
		mode = 'basic',
		value = $bindable([]),
		inputValue = $bindable(''),
		open = $bindable(undefined as boolean | undefined),
		highlightedValue = $bindable(undefined as string | null | undefined),
		allowCustomValue,
		openOnClick,
		openOnFocus,
		onValueChange,
		onInputValueChange,
		onOpenChange,
		onHighlightChange
	}: {
		mode?: 'basic' | 'multiple' | 'groups' | 'static';
		value?: string[];
		inputValue?: string;
		open?: boolean | undefined;
		highlightedValue?: string | null | undefined;
		allowCustomValue?: boolean;
		openOnClick?: boolean;
		openOnFocus?: boolean;
		onValueChange?: (details: { value: string[] }) => void;
		onInputValueChange?: (details: { inputValue: string; reason: string }) => void;
		onOpenChange?: (details: { open: boolean; reason: string }) => void;
		onHighlightChange?: (details: { highlightedValue: string | null }) => void;
	} = $props();

	let query = $state('');

	const source = $derived(mode === 'groups' ? allCountries : allFruits);

	const items = $derived(
		mode === 'static'
			? source
			: source.filter((item) =>
					String(item.label ?? item.value)
						.toLowerCase()
						.includes(query.toLowerCase())
				)
	);

	const groups = $derived(
		items.reduce<Record<string, ComboboxEntry[]>>((acc, item) => {
			const key = String(item.continent ?? 'Other');
			(acc[key] ??= []).push(item);
			return acc;
		}, {})
	);
</script>

<Combobox
	bind:value
	bind:inputValue
	bind:open
	bind:highlightedValue
	name="fruit"
	{items}
	{allowCustomValue}
	multiple={mode === 'multiple'}
	{openOnClick}
	{openOnFocus}
	openOnChange={mode === 'static' ? false : true}
	onInputValueChange={(details) => {
		if (details.reason === 'input-change') query = details.inputValue;
		onInputValueChange?.(details);
	}}
	onValueChange={(details) => onValueChange?.(details)}
	onOpenChange={(details) => onOpenChange?.(details)}
	onHighlightChange={(details) => onHighlightChange?.(details)}
>
	<ComboboxLabel>Fruit</ComboboxLabel>
	{#if mode === 'multiple'}
		<div data-testid="chips">
			{#each value as entry (entry)}
				<span data-testid="chip">
					{entry}
					<button type="button" data-testid="chip-remove" onclick={() => (value = value.filter((v) => v !== entry))}>
						Remove {entry}
					</button>
				</span>
			{/each}
		</div>
	{/if}
	<ComboboxControl>
		<ComboboxInput placeholder="e.g. Mango" />
		<ComboboxClearTrigger />
		<ComboboxTrigger />
	</ComboboxControl>
	<ComboboxPositioner>
		<ComboboxContent>
			<ComboboxEmpty>No fruits found.</ComboboxEmpty>
			{#if mode === 'groups'}
				{#each Object.entries(groups) as [continent, entries] (continent)}
					<ComboboxItemGroup id={continent}>
						<ComboboxItemGroupLabel>{continent}</ComboboxItemGroupLabel>
						{#each entries as item (item.value)}
							<ComboboxOption {item}>{item.label}</ComboboxOption>
						{/each}
					</ComboboxItemGroup>
				{/each}
			{:else}
				<ComboboxList>
					{#each items as item (item.value)}
						<ComboboxItem {item}>
							<ComboboxItemText>{item.label}</ComboboxItemText>
							<ComboboxItemIndicator />
						</ComboboxItem>
					{/each}
				</ComboboxList>
			{/if}
		</ComboboxContent>
	</ComboboxPositioner>
</Combobox>
