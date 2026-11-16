<script lang="ts">
	import { onMount } from 'svelte';
	import Tour from '../../src/lib/components/tour/Tour.svelte';
	import TourActionList from '../../src/lib/components/tour/TourActionList.svelte';
	import TourArrow from '../../src/lib/components/tour/TourArrow.svelte';
	import TourBackdrop from '../../src/lib/components/tour/TourBackdrop.svelte';
	import TourBody from '../../src/lib/components/tour/TourBody.svelte';
	import TourCloseIcon from '../../src/lib/components/tour/TourCloseIcon.svelte';
	import TourContent from '../../src/lib/components/tour/TourContent.svelte';
	import TourControl from '../../src/lib/components/tour/TourControl.svelte';
	import TourDescription from '../../src/lib/components/tour/TourDescription.svelte';
	import TourPositioner from '../../src/lib/components/tour/TourPositioner.svelte';
	import TourProgressBar from '../../src/lib/components/tour/TourProgressBar.svelte';
	import TourProgressText from '../../src/lib/components/tour/TourProgressText.svelte';
	import TourSpotlight from '../../src/lib/components/tour/TourSpotlight.svelte';
	import TourTitle from '../../src/lib/components/tour/TourTitle.svelte';
	import { createTour } from '../../src/lib/components/tour/tour.state.svelte';
	import type { TourStepDetails } from '../../src/lib/components/tour/tour.state.svelte';

	let {
		keyboardNavigation = true,
		closeOnEscape = true,
		closeOnInteractOutside = true,
		preventInteraction = false,
		withArrow = true,
		withProgressBar = true,
		spotlightRadius = 4,
		lateTarget = false,
		rootMode = false
	}: {
		keyboardNavigation?: boolean;
		closeOnEscape?: boolean;
		closeOnInteractOutside?: boolean;
		preventInteraction?: boolean;
		withArrow?: boolean;
		withProgressBar?: boolean;
		spotlightRadius?: number;
		lateTarget?: boolean;
		rootMode?: boolean;
	} = $props();

	const steps = [
		{
			id: 'welcome',
			type: 'dialog',
			title: 'Welcome to the workspace',
			description: 'Start with a dialog step.',
			actions: [{ label: 'Start', action: 'next' }]
		},
		{
			id: 'upload',
			type: 'tooltip',
			title: 'Upload files',
			description: 'Tooltip steps anchor to a page control.',
			target: () => document.getElementById('tour-upload'),
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
			description: 'Floating steps stay in the viewport.',
			actions: [{ label: 'Finish', action: 'dismiss' }]
		}
	] satisfies TourStepDetails[];

	let status = $state('idle');
	let stepId = $state<string | null>(null);
	let lateMounted = $state(false);

	const api = createTour(
		() => ({
			steps,
			keyboardNavigation,
			closeOnEscape,
			closeOnInteractOutside,
			preventInteraction,
			spotlightRadius,
			onStatusChange: (details) => {
				status = details.status;
			},
			onStepChange: (details) => {
				stepId = details.stepId;
			}
		}),
		'harness'
	);

	onMount(() => {
		if (!lateTarget) return;
		const timer = setTimeout(() => {
			lateMounted = true;
		}, 20);
		return () => clearTimeout(timer);
	});
</script>

{#if rootMode}
	<Tour {steps} keyboardNavigation={false} />
{:else}
	{#if !lateTarget || lateMounted}
		<button type="button" id="tour-upload">Upload files</button>
	{/if}

	<button
		type="button"
		data-testid="start"
		onclick={() => {
			api.start();
		}}>Start tour</button
	>
	<button
		type="button"
		data-testid="start-upload"
		onclick={() => {
			api.start('upload');
		}}>Start at upload</button
	>
	<button
		type="button"
		data-testid="next"
		onclick={() => {
			api.next();
		}}>Next step</button
	>
	<button
		type="button"
		data-testid="skip"
		onclick={() => {
			api.skip();
		}}>Skip tour</button
	>

	<Tour
		tour={api}
		{keyboardNavigation}
		{closeOnEscape}
		{closeOnInteractOutside}
		{preventInteraction}
	>
		<TourBackdrop />
		<TourSpotlight />
		<TourPositioner>
			{#if withArrow}
				<TourArrow />
			{/if}
			<TourContent>
				<TourCloseIcon />
				<TourBody>
					<TourTitle />
					<TourDescription />
					<TourProgressText />
					{#if withProgressBar}
						<TourProgressBar />
					{/if}
				</TourBody>
				<TourControl>
					<TourActionList />
				</TourControl>
			</TourContent>
		</TourPositioner>
	</Tour>
{/if}

<output data-testid="status">{status}</output>
<output data-testid="step">{stepId ?? 'none'}</output>
