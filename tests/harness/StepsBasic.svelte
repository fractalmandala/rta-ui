<script lang="ts">
	import {
		Steps,
		StepsCompletedContent,
		StepsContent,
		StepsIndicator,
		StepsItem,
		StepsList,
		StepsNextTrigger,
		StepsPrevTrigger,
		StepsProgress,
		StepsSeparator,
		StepsTrigger
	} from '../../src/lib/index';

	let {
		count = undefined,
		linear = undefined,
		onStepChange = undefined,
		step = $bindable(undefined)
	}: {
		count?: number;
		linear?: boolean;
		onStepChange?: (details: { step: number }) => void;
		step?: number;
	} = $props();

	const titles = ['Account', 'Profile', 'Billing'];
</script>

<Steps {count} {linear} {onStepChange} bind:step>
	<StepsList>
		{#each titles as title, index (title)}
			<StepsItem {index}>
				<StepsTrigger>
					<StepsIndicator />
					<span>{title}</span>
				</StepsTrigger>
				<StepsSeparator />
			</StepsItem>
		{/each}
	</StepsList>
	<StepsProgress />
	{#each titles as title, index (title)}
		<StepsContent {index}>{title} panel</StepsContent>
	{/each}
	<StepsCompletedContent>Done</StepsCompletedContent>
	<StepsPrevTrigger>Back</StepsPrevTrigger>
	<StepsNextTrigger>Next</StepsNextTrigger>
</Steps>
