<script lang="ts">
	import {
		ColorPicker,
		ColorPickerArea,
		ColorPickerChannelInput,
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
		ColorPickerTrigger
	} from '../../lib/components/color-picker/index';

	const swatches = ['#0f172a', '#2563eb', '#16a34a', '#f97316'];
</script>

<ColorPicker defaultValue="#eb5e41" name="accent" closeOnSelect>
	<ColorPickerLabel>Accent</ColorPickerLabel>
	<ColorPickerControl>
		<ColorPickerChannelInput channel="hex" />
		<ColorPickerChannelInput channel="alpha" />
		<ColorPickerTrigger />
	</ColorPickerControl>
	<ColorPickerPositioner>
		<ColorPickerContent>
			<ColorPickerArea />
			<div class="row">
				<ColorPickerEyeDropperTrigger />
				<ColorPickerSliders />
			</div>
			<ColorPickerSwatchGroup>
				{#each swatches as color (color)}
					<ColorPickerSwatchTrigger value={color} />
				{/each}
			</ColorPickerSwatchGroup>
			<ColorPickerFormatSelect />
		</ColorPickerContent>
	</ColorPickerPositioner>
	<ColorPickerHiddenInput />
</ColorPicker>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
</style>
