<script lang="ts">
	import {
		Slider,
		SliderControl,
		SliderLabel,
		SliderMarker,
		SliderMarkerGroup,
		SliderRange,
		SliderThumbs,
		SliderTrack,
		SliderValueText
	} from '../../lib/index';
</script>

<Slider defaultValue={[25, 75]} thumbCollisionBehavior="swap">
	<SliderLabel>Price range</SliderLabel>
	<SliderValueText />
	<SliderControl>
		<SliderTrack>
			<SliderRange />
		</SliderTrack>
		<SliderThumbs />
	</SliderControl>
	<SliderMarkerGroup>
		<SliderMarker value={0} />
		<SliderMarker value={50} />
		<SliderMarker value={100} />
	</SliderMarkerGroup>
</Slider>
