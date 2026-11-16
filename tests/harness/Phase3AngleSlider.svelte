<script lang="ts">
	import {
		AngleSlider,
		AngleSliderControl,
		AngleSliderHiddenInput,
		AngleSliderLabel,
		AngleSliderMarks,
		AngleSliderDial,
		AngleSliderThumb,
		AngleSliderValueText,
		type AngleSliderValueChangeDetails,
		type AngleSliderValueChangeEndDetails
	} from '../../src/lib/components/angle-slider/index';

	let {
		value = $bindable(undefined),
		defaultValue = 0,
		step = undefined,
		dir = undefined,
		disabled = false,
		readOnly = false,
		invalid = false,
		name = 'angle',
		dial = false,
		marks = false,
		hiddenInput = false,
		onValueChange,
		onValueChangeEnd
	}: {
		value?: number;
		defaultValue?: number;
		step?: number;
		dir?: 'ltr' | 'rtl' | 'auto' | null;
		disabled?: boolean;
		readOnly?: boolean;
		invalid?: boolean;
		name?: string;
		dial?: boolean;
		marks?: boolean;
		hiddenInput?: boolean;
		onValueChange?: (details: AngleSliderValueChangeDetails) => void;
		onValueChangeEnd?: (details: AngleSliderValueChangeEndDetails) => void;
	} = $props();
</script>

<AngleSlider
	bind:value
	{defaultValue}
	{step}
	{dir}
	{disabled}
	{readOnly}
	{invalid}
	{name}
	{onValueChange}
	{onValueChangeEnd}
>
	<AngleSliderLabel>Rotation</AngleSliderLabel>
	{#if dial}
		<AngleSliderDial>
			{#if marks}
				<AngleSliderMarks values={[0, 90, 180, 270]} />
			{/if}
		</AngleSliderDial>
	{:else}
		<AngleSliderControl>
			<AngleSliderValueText />
			<AngleSliderThumb />
			{#if marks}
				<AngleSliderMarks values={[0, 90, 180, 270]} />
			{/if}
		</AngleSliderControl>
	{/if}
	{#if hiddenInput}
		<AngleSliderHiddenInput />
	{/if}
</AngleSlider>
