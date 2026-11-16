<script lang="ts">
	import {
		ProgressLinear,
		ProgressLinearLabel,
		ProgressLinearRange,
		ProgressLinearTrack,
		ProgressLinearValueText
	} from '../../src/lib/components/progress-linear/index.js';
	import {
		ProgressCircular,
		ProgressCircularRing
	} from '../../src/lib/components/progress-circular/index.js';

	let { value = undefined } = $props();
</script>

<ProgressLinear {value}>
	<ProgressLinearLabel>Upload</ProgressLinearLabel>
	<ProgressLinearTrack>
		<ProgressLinearRange />
	</ProgressLinearTrack>
	<ProgressLinearValueText />
</ProgressLinear>

<ProgressCircular {value}>
	<ProgressCircularRing />
</ProgressCircular>
