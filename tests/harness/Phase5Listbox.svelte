<script lang="ts">
	import {
		Listbox,
		ListboxClearTrigger,
		ListboxContent,
		ListboxEmpty,
		ListboxFilter,
		ListboxInput,
		ListboxItem,
		ListboxItemGroup,
		ListboxItemGroupLabel,
		ListboxItemIndicator,
		ListboxItemText,
		ListboxLabel,
		ListboxValueText,
		type ListboxValueChangeDetails,
		type ListboxSelectionMode
	} from '../../src/lib/components/listbox/index';

	interface Option {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface OptionGroup {
		id: string;
		label: string;
		items: Option[];
	}

	let {
		value = $bindable(),
		defaultValue,
		disabled = false,
		groups = $bindable([
			{
				id: 'fruits',
				label: 'Fruits',
				items: [
					{ value: 'apple', label: 'Apple' },
					{ value: 'apricot', label: 'Apricot' },
					{ value: 'banana', label: 'Banana' },
					{ value: 'cherry', label: 'Cherry', disabled: true }
				]
			},
			{
				id: 'vegetables',
				label: 'Vegetables',
				items: [
					{ value: 'carrot', label: 'Carrot' },
					{ value: 'daikon', label: 'Daikon' }
				]
			}
		] as OptionGroup[]),
		selectionMode = 'single',
		showInput = true,
		onValueChange
	}: {
		value?: string | string[];
		defaultValue?: string | string[];
		disabled?: boolean;
		groups?: OptionGroup[];
		selectionMode?: ListboxSelectionMode;
		showInput?: boolean;
		onValueChange?: (details: ListboxValueChangeDetails) => void;
	} = $props();

	const items = $derived(groups.flatMap((group) => group.items));

	const ids = {
		root: 'listbox-root',
		content: 'listbox-content',
		label: 'listbox-label',
		item: (value: string | number) => `listbox-item-${value}`,
		itemGroup: (id: string | number) => `listbox-group-${id}`,
		itemGroupLabel: (id: string | number) => `listbox-group-label-${id}`
	};
</script>

<Listbox
	bind:value
	{defaultValue}
	{disabled}
	{items}
	{selectionMode}
	{ids}
	typeahead
	loopFocus={false}
	onValueChange={(details) => {
		onValueChange?.(details);
	}}
>
	<ListboxLabel>Produce</ListboxLabel>
	{#if showInput}
		<ListboxFilter>
			<ListboxInput placeholder="Search produce" />
		</ListboxFilter>
		<ListboxClearTrigger />
	{/if}
	<ListboxContent>
		<ListboxEmpty>Nothing matches.</ListboxEmpty>
		{#each groups as group (group.id)}
			<ListboxItemGroup id={group.id}>
				<ListboxItemGroupLabel>{group.label}</ListboxItemGroupLabel>
				{#each group.items as item (item.value)}
					<ListboxItem {item} highlightOnHover>
						<ListboxItemText>{item.label}</ListboxItemText>
						<ListboxItemIndicator />
					</ListboxItem>
				{/each}
			</ListboxItemGroup>
		{/each}
	</ListboxContent>
	<ListboxValueText placeholder="None selected" />
</Listbox>
