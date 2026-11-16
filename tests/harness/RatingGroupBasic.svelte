<script lang="ts">
	import {
		RatingGroup,
		RatingGroupControl,
		RatingGroupHiddenInput,
		RatingGroupItems,
		RatingGroupLabel
	} from '../../src/lib/index';

	let {
		allowHalf = undefined,
		disabled = undefined,
		onValueChange = undefined,
		readOnly = undefined,
		value = $bindable(undefined)
	}: {
		allowHalf?: boolean;
		disabled?: boolean;
		onValueChange?: (details: { value: number }) => void;
		readOnly?: boolean;
		value?: number;
	} = $props();
</script>

<RatingGroup {allowHalf} {disabled} {onValueChange} {readOnly} bind:value name="rating">
	<RatingGroupLabel>Rating</RatingGroupLabel>
	<RatingGroupControl>
		<RatingGroupItems />
	</RatingGroupControl>
	<RatingGroupHiddenInput />
</RatingGroup>
