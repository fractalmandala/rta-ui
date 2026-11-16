<script lang="ts">
	import {
		Steps,
		StepsContent,
		StepsIndicator,
		StepsItem,
		StepsList,
		StepsNextTrigger,
		StepsPrevTrigger,
		StepsSeparator,
		StepsTrigger
	} from '../../lib/index';

	const items = ['Account', 'Profile', 'Billing'];
</script>

<Steps count={items.length}>
	<StepsList>
		{#each items as item, index (item)}
			<StepsItem {index}>
				<StepsTrigger>
					<StepsIndicator />
					<span>{item}</span>
				</StepsTrigger>
				<StepsSeparator />
			</StepsItem>
		{/each}
	</StepsList>
	{#each items as item, index (item)}
		<StepsContent {index}>{item} settings.</StepsContent>
	{/each}
	<StepsPrevTrigger>Back</StepsPrevTrigger>
	<StepsNextTrigger>Next</StepsNextTrigger>
</Steps>
