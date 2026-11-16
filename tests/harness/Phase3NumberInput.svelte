<script lang="ts">
	import {
		NumberInput,
		NumberInputControl,
		NumberInputDecrementTrigger,
		NumberInputField,
		NumberInputIncrementTrigger,
		NumberInputInput,
		NumberInputLabel,
		NumberInputScrubber,
		NumberInputValueText,
		type NumberInputFocusChangeDetails,
		type NumberInputSize,
		type NumberInputTranslations,
		type NumberInputValueChangeDetails,
		type NumberInputValueInvalidDetails
	} from '../../src/lib/components/number-input/index';

	let {
		value = $bindable(undefined),
		defaultValue = '',
		min = undefined,
		max = undefined,
		step = undefined,
		largeStep = undefined,
		smallStep = undefined,
		locale = undefined,
		formatOptions = undefined,
		allowMouseWheel = false,
		allowOverflow = false,
		clampValueOnBlur = undefined,
		focusInputOnChange = undefined,
		spinOnPress = undefined,
		disabled = false,
		readOnly = false,
		invalid = undefined,
		required = false,
		name = 'quantity',
		size = 'md',
		translations = undefined,
		fields = false,
		scrubber = false,
		valueText = false,
		onValueChange,
		onValueInvalid,
		onValueCommit,
		onFocusChange
	}: {
		value?: string;
		defaultValue?: string;
		min?: number;
		max?: number;
		step?: number;
		largeStep?: number;
		smallStep?: number;
		locale?: string;
		formatOptions?: Intl.NumberFormatOptions;
		allowMouseWheel?: boolean;
		allowOverflow?: boolean;
		clampValueOnBlur?: boolean;
		focusInputOnChange?: boolean;
		spinOnPress?: boolean;
		disabled?: boolean;
		readOnly?: boolean;
		invalid?: boolean;
		required?: boolean;
		name?: string;
		size?: NumberInputSize;
		translations?: NumberInputTranslations;
		fields?: boolean;
		scrubber?: boolean;
		valueText?: boolean;
		onValueChange?: (details: NumberInputValueChangeDetails) => void;
		onValueInvalid?: (details: NumberInputValueInvalidDetails) => void;
		onValueCommit?: (details: NumberInputValueChangeDetails) => void;
		onFocusChange?: (details: NumberInputFocusChangeDetails) => void;
	} = $props();
</script>

<NumberInput
	bind:value
	{defaultValue}
	{min}
	{max}
	{step}
	{largeStep}
	{smallStep}
	{locale}
	{formatOptions}
	{allowMouseWheel}
	{allowOverflow}
	{clampValueOnBlur}
	{focusInputOnChange}
	{spinOnPress}
	{disabled}
	{readOnly}
	{invalid}
	{required}
	{name}
	{size}
	{translations}
	{onValueChange}
	{onValueInvalid}
	{onValueCommit}
	{onFocusChange}
>
	<NumberInputLabel>Quantity</NumberInputLabel>
	{#if fields}
		<NumberInputField />
	{:else}
		<NumberInputControl>
			<NumberInputDecrementTrigger />
			<NumberInputInput />
			<NumberInputIncrementTrigger />
		</NumberInputControl>
	{/if}
	{#if scrubber}
		<NumberInputScrubber data-testid="scrubber">Scrub</NumberInputScrubber>
	{/if}
	{#if valueText}
		<NumberInputValueText />
	{/if}
</NumberInput>
