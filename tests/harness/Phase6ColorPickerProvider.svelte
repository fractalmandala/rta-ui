<script lang="ts">
	import {
		ColorPickerArea,
		ColorPickerChannelSlider,
		ColorPickerControl,
		ColorPickerHiddenInput,
		ColorPickerLabel,
		ColorPickerRootProvider,
		ColorPickerValueText,
		createColorPicker
	} from '../../src/lib/components/color-picker/index';

	let { defaultValue = '#eb5e41' } = $props();

	const api = createColorPicker(() => ({ defaultValue, inline: true, name: 'provider-color' }), 'provider');
</script>

<ColorPickerRootProvider value={api}>
	<ColorPickerLabel>Provider color</ColorPickerLabel>
	<ColorPickerControl>
		<ColorPickerValueText />
	</ColorPickerControl>
	<ColorPickerArea />
	<ColorPickerChannelSlider channel="hue" />
	<ColorPickerHiddenInput />
</ColorPickerRootProvider>
