<script lang="ts">
	import {
		ComboboxContent,
		ComboboxControl,
		ComboboxEmpty,
		ComboboxInput,
		ComboboxItem,
		ComboboxItemIndicator,
		ComboboxItemText,
		ComboboxLabel,
		ComboboxList,
		ComboboxPositioner,
		ComboboxRootProvider,
		ComboboxTrigger,
		createCombobox,
		setComboboxContext,
		type ComboboxEntry
	} from '../../src/lib/components/combobox/index';

	const items: ComboboxEntry[] = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'mango', label: 'Mango' },
		{ value: 'papaya', label: 'Papaya' }
	];

	let {
		value,
		defaultValue = ['mango'],
		defaultInputValue = '',
		inputValue,
		onValueChange
	}: {
		value?: string[];
		defaultValue?: string[];
		defaultInputValue?: string;
		inputValue?: string;
		onValueChange?: (details: { value: string[] }) => void;
	} = $props();

	const api = createCombobox(
		() => ({
			items,
			multiple: true,
			name: 'fruit',
			value,
			defaultValue,
			defaultInputValue,
			inputValue,
			onValueChange: (details) => onValueChange?.(details)
		}),
		'phase5-provider'
	);

	setComboboxContext(api);
</script>

<div>
	<button type="button" data-testid="api-open" onclick={() => api.setOpen(true)}>Open</button>
	<button type="button" data-testid="api-close" onclick={() => api.setOpen(false)}>Close</button>
	<button type="button" data-testid="api-clear" onclick={() => api.clearValue('mango')}>
		Clear mango
	</button>
	<button type="button" data-testid="api-input" onclick={() => api.setInputValue('pap')}>
		Set input
	</button>
</div>

<ComboboxRootProvider value={api}>
	<ComboboxLabel>Fruit</ComboboxLabel>
	<ComboboxControl>
		<ComboboxInput placeholder="e.g. Mango" />
		<ComboboxTrigger />
	</ComboboxControl>
	<ComboboxPositioner>
		<ComboboxContent>
			<ComboboxEmpty>No fruits found.</ComboboxEmpty>
			<ComboboxList>
				{#each items as item (item.value)}
					<ComboboxItem {item}>
						<ComboboxItemText>{item.label}</ComboboxItemText>
						<ComboboxItemIndicator />
					</ComboboxItem>
				{/each}
			</ComboboxList>
		</ComboboxContent>
	</ComboboxPositioner>
</ComboboxRootProvider>
