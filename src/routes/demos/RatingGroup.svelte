<script lang="ts">
	import {
		RatingGroup,
		RatingGroupControl,
		RatingGroupHiddenInput,
		RatingGroupItems,
		RatingGroupLabel
	} from '../../lib/index';
</script>

<RatingGroup defaultValue={4} allowHalf>
	<RatingGroupLabel>Overall satisfaction</RatingGroupLabel>
	<RatingGroupControl>
		<RatingGroupItems />
	</RatingGroupControl>
	<RatingGroupHiddenInput />
</RatingGroup>
