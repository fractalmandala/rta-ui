<script lang="ts">
	import Tour from '../../lib/components/tour/Tour.svelte';
	import TourActionList from '../../lib/components/tour/TourActionList.svelte';
	import TourArrow from '../../lib/components/tour/TourArrow.svelte';
	import TourBackdrop from '../../lib/components/tour/TourBackdrop.svelte';
	import TourBody from '../../lib/components/tour/TourBody.svelte';
	import TourCloseIcon from '../../lib/components/tour/TourCloseIcon.svelte';
	import TourContent from '../../lib/components/tour/TourContent.svelte';
	import TourControl from '../../lib/components/tour/TourControl.svelte';
	import TourDescription from '../../lib/components/tour/TourDescription.svelte';
	import TourPositioner from '../../lib/components/tour/TourPositioner.svelte';
	import TourProgressBar from '../../lib/components/tour/TourProgressBar.svelte';
	import TourProgressText from '../../lib/components/tour/TourProgressText.svelte';
	import TourSpotlight from '../../lib/components/tour/TourSpotlight.svelte';
	import TourTitle from '../../lib/components/tour/TourTitle.svelte';
	import { createTour } from '../../lib/components/tour/tour.state.svelte';
	import type { TourStepDetails } from '../../lib/components/tour/tour.state.svelte';

	const steps = [
		{
			id: 'welcome',
			type: 'dialog',
			title: 'Welcome to the workspace',
			description: 'Start with a dialog step, then move to a highlighted page control.',
			actions: [{ label: 'Start', action: 'next' }]
		},
		{
			id: 'upload',
			type: 'tooltip',
			title: 'Upload files',
			description: 'Tooltip steps are anchored to the target element.',
			target: () => document.getElementById('tour-demo-upload'),
			actions: [
				{ label: 'Back', action: 'prev' },
				{ label: 'Next', action: 'next' }
			]
		},
		{
			id: 'finish',
			type: 'floating',
			placement: 'bottom-end',
			title: 'You are ready',
			description: 'Floating steps stay in the viewport without a target.',
			actions: [{ label: 'Finish', action: 'dismiss' }]
		}
	] satisfies TourStepDetails[];

	const tour = createTour(() => ({ steps, spotlightRadius: 6 }), 'demo-tour');
</script>

<div class="demo-row">
	<button type="button" id="tour-demo-upload">Upload files</button>
	<button type="button" onclick={() => tour.start()}>Start tour</button>
	<button type="button" onclick={() => tour.next()}>Next step</button>
	<button type="button" onclick={() => tour.dismiss()}>End tour</button>
</div>

<Tour {tour}>
	<TourBackdrop />
	<TourSpotlight />
	<TourPositioner>
		<TourArrow />
		<TourContent>
			<TourCloseIcon />
			<TourBody>
				<TourTitle />
				<TourDescription />
				<TourProgressText />
				<TourProgressBar />
			</TourBody>
			<TourControl>
				<TourActionList />
			</TourControl>
		</TourContent>
	</TourPositioner>
</Tour>
