<script lang="ts">
	import {
		Select,
		SelectContent,
		SelectField,
		SelectHiddenSelect,
		SelectItemGroup,
		SelectItemGroupLabel,
		SelectLabel,
		SelectList,
		SelectOption,
		SelectPositioner
	} from '../../lib/components/select/index';

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

<Select {items} name="produce" defaultValue={['apple']}>
	<SelectLabel>Produce</SelectLabel>
	<SelectField placeholder="Pick a produce" clearLabel="Clear selection" />
	<SelectHiddenSelect />
	<SelectPositioner>
		<SelectContent>
			<SelectList>
				{#each groups as group (group.id)}
					<SelectItemGroup id={group.id}>
						<SelectItemGroupLabel>{group.label}</SelectItemGroupLabel>
						{#each group.items as item (item.value)}
							<SelectOption {item}>{item.label}</SelectOption>
						{/each}
					</SelectItemGroup>
				{/each}
			</SelectList>
		</SelectContent>
	</SelectPositioner>
</Select>
