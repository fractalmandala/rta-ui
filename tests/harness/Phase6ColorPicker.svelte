<script lang="ts">
	import {
		ColorPicker,
		ColorPickerArea,
		ColorPickerChannelInput,
		ColorPickerChannelSlider,
		ColorPickerChannelSliderLabel,
		ColorPickerChannelSliderThumb,
		ColorPickerChannelSliderTrack,
		ColorPickerChannelSliderValueText,
		ColorPickerContent,
		ColorPickerControl,
		ColorPickerEyeDropperTrigger,
		ColorPickerFormatSelect,
		ColorPickerHiddenInput,
		ColorPickerLabel,
		ColorPickerPositioner,
		ColorPickerSliders,
		ColorPickerSwatchGroup,
		ColorPickerSwatchTrigger,
		ColorPickerTrigger,
		ColorPickerValueText,
		ColorPickerView,
		type ColorFormat,
		type ColorPickerFormatChangeDetails,
		type ColorPickerOpenChangeDetails,
		type ColorPickerValueChangeDetails
	} from '../../src/lib/components/color-picker/index';

	let {
		value = $bindable(undefined),
		defaultValue = '#eb5e41',
		format = $bindable(undefined),
		open = $bindable(undefined),
		defaultOpen = false,
		inline = false,
		closeOnSelect = false,
		disabled = false,
		readOnly = false,
		invalid = false,
		name = 'accent',
		dir = undefined,
		portalled = true,
		swatches = ['#0f172a', '#2563eb', '#16a34a'],
		onValueChange,
		onValueChangeEnd,
		onOpenChange,
		onFormatChange
	}: {
		value?: string;
		defaultValue?: string;
		format?: ColorFormat;
		open?: boolean;
		defaultOpen?: boolean;
		inline?: boolean;
		closeOnSelect?: boolean;
		disabled?: boolean;
		readOnly?: boolean;
		invalid?: boolean;
		name?: string;
		dir?: 'ltr' | 'rtl' | 'auto' | null;
		portalled?: boolean;
		swatches?: string[];
		onValueChange?: (details: ColorPickerValueChangeDetails) => void;
		onValueChangeEnd?: (details: ColorPickerValueChangeDetails) => void;
		onOpenChange?: (details: ColorPickerOpenChangeDetails) => void;
		onFormatChange?: (details: ColorPickerFormatChangeDetails) => void;
	} = $props();
</script>

<form>
	<ColorPicker
		bind:value
		bind:format
		bind:open
		{defaultValue}
		{defaultOpen}
		{inline}
		{closeOnSelect}
		{disabled}
		{readOnly}
		{invalid}
		{name}
		{dir}
		{portalled}
		{onValueChange}
		{onValueChangeEnd}
		{onOpenChange}
		{onFormatChange}
	>
		<ColorPickerLabel>Color</ColorPickerLabel>
		<ColorPickerControl>
			<ColorPickerChannelInput channel="hex" />
			<ColorPickerChannelInput channel="alpha" />
			<ColorPickerTrigger />
		</ColorPickerControl>
		<ColorPickerValueText />
		<ColorPickerPositioner>
			<ColorPickerContent>
				<ColorPickerArea />
				<ColorPickerSliders />
				<ColorPickerChannelSlider channel="saturation" orientation="vertical">
					<ColorPickerChannelSliderLabel>Saturation</ColorPickerChannelSliderLabel>
					<ColorPickerChannelSliderTrack />
					<ColorPickerChannelSliderThumb />
					<ColorPickerChannelSliderValueText />
				</ColorPickerChannelSlider>
				<ColorPickerSwatchGroup>
					{#each swatches as color (color)}
						<ColorPickerSwatchTrigger value={color} />
					{/each}
				</ColorPickerSwatchGroup>
				<ColorPickerEyeDropperTrigger />
				<ColorPickerFormatSelect />
				<ColorPickerView format="rgba">
					<ColorPickerChannelInput channel="hex" />
				</ColorPickerView>
				<ColorPickerView format="hsla">
					<ColorPickerChannelInput channel="hue" />
					<ColorPickerChannelInput channel="lightness" />
				</ColorPickerView>
			</ColorPickerContent>
		</ColorPickerPositioner>
		<ColorPickerHiddenInput />
	</ColorPicker>
</form>
