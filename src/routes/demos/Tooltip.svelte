<script lang="ts">
	import {
		Tooltip,
		TooltipArrow,
		TooltipContent,
		TooltipPositioner,
		TooltipTrigger
	} from '../../lib/components/tooltip/index';
</script>

<Tooltip openDelay={200} closeDelay={100} positioning={{ placement: 'top' }}>
	<TooltipTrigger>Hover me</TooltipTrigger>
	<TooltipPositioner>
		<TooltipContent>
			<TooltipArrow />
			Tooltips sit above the trigger and delay on purpose.
		</TooltipContent>
	</TooltipPositioner>
</Tooltip>
