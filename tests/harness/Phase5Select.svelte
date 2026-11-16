<script lang="ts">
	import {
		Select,
		SelectClearTrigger,
		SelectContent,
		SelectControl,
		SelectField,
		SelectHiddenSelect,
		SelectIndicator,
		SelectItemGroup,
		SelectItemGroupLabel,
		SelectLabel,
		SelectList,
		SelectOption,
		SelectPositioner,
		SelectTrigger,
		SelectValueText,
		type SelectOpenChangeDetails,
		type SelectValueChangeDetails
	} from '../../src/lib/components/select/index';

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
		open = $bindable(),
		defaultOpen = false,
		multiple = false,
		closeOnSelect,
		deselectable = false,
		disabled = false,
		invalid = false,
		lazyMount = true,
		unmountOnExit = false,
		portalled = false,
		variant = 'parts',
		groups = [
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
		] as OptionGroup[],
		onValueChange,
		onOpenChange
	}: {
		value?: string | string[];
		defaultValue?: string | string[];
		open?: boolean;
		defaultOpen?: boolean;
		multiple?: boolean;
		closeOnSelect?: boolean;
		deselectable?: boolean;
		disabled?: boolean;
		invalid?: boolean;
		lazyMount?: boolean;
		unmountOnExit?: boolean;
		portalled?: boolean;
		variant?: 'parts' | 'field';
		groups?: OptionGroup[];
		onValueChange?: (details: SelectValueChangeDetails) => void;
		onOpenChange?: (details: SelectOpenChangeDetails) => void;
	} = $props();

	const items = $derived(groups.flatMap((group) => group.items));

	const ids = {
		root: 'select-root',
		content: 'select-content',
		control: 'select-control',
		trigger: 'select-trigger',
		clearTrigger: 'select-clear-trigger',
		label: 'select-label',
		hiddenSelect: 'select-hidden',
		positioner: 'select-positioner',
		item: (value: string | number) => `select-item-${value}`,
		itemGroup: (id: string | number) => `select-group-${id}`,
		itemGroupLabel: (id: string | number) => `select-group-label-${id}`
	};
</script>

<Select
	bind:value
	bind:open
	{defaultValue}
	{defaultOpen}
	{multiple}
	{closeOnSelect}
	{deselectable}
	{disabled}
	{invalid}
	{items}
	{ids}
	{portalled}
	{lazyMount}
	{unmountOnExit}
	name="produce"
	onValueChange={(details) => onValueChange?.(details)}
	onOpenChange={(details) => onOpenChange?.(details)}
>
	<SelectLabel>Produce</SelectLabel>
	{#if variant === 'field'}
		<SelectField placeholder="Pick a produce" clearLabel="Clear selection" />
	{:else}
		<SelectControl>
			<SelectTrigger>
				<SelectValueText placeholder="Pick a produce" />
			</SelectTrigger>
			<SelectClearTrigger />
			<SelectIndicator />
		</SelectControl>
	{/if}
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
