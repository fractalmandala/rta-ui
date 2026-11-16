<script lang="ts">
	import {
		AngleSlider,
		AngleSliderControl,
		AngleSliderLabel,
		AngleSliderMarks,
		AngleSliderThumb,
		AngleSliderValueText
	} from '../../lib/index';
</script>

<AngleSlider defaultValue={135} step={5}>
	<AngleSliderLabel>Rotation</AngleSliderLabel>
	<AngleSliderControl>
		<AngleSliderValueText />
		<AngleSliderThumb />
		<AngleSliderMarks values={[0, 90, 180, 270]} />
	</AngleSliderControl>
</AngleSlider>
