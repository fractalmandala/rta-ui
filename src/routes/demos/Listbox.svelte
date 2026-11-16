<script lang="ts">
	import {
		Listbox,
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
		ListboxValueText
	} from '../../lib/components/listbox/index';

	const groups = [
		{
			id: 'fruits',
			label: 'Fruits',
			items: [
				{ value: 'apple', label: 'Apple' },
				{ value: 'banana', label: 'Banana' },
				{ value: 'cherry', label: 'Cherry' }
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
	];

	const items = groups.flatMap((group) => group.items);
</script>

<Listbox {items} defaultValue={['banana']} selectionMode="multiple">
	<ListboxLabel>Produce</ListboxLabel>
	<ListboxFilter>
		<ListboxInput placeholder="Search produce" />
	</ListboxFilter>
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
