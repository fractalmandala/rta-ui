<script lang="ts">
	import {
		ProgressLinear,
		ProgressLinearLabel,
		ProgressLinearRange,
		ProgressLinearTrack,
		ProgressLinearValueText
	} from '../../lib/index';
</script>

<ProgressLinear value={62}>
	<ProgressLinearLabel>Uploading</ProgressLinearLabel>
	<ProgressLinearTrack>
		<ProgressLinearRange />
	</ProgressLinearTrack>
	<ProgressLinearValueText />
</ProgressLinear>

<ProgressLinear value={null}>
	<ProgressLinearLabel>Indeterminate</ProgressLinearLabel>
	<ProgressLinearTrack>
		<ProgressLinearRange />
	</ProgressLinearTrack>
</ProgressLinear>
