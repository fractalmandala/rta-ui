<script lang="ts">
	import HoverCard from '../../src/lib/components/hover-card/HoverCard.svelte';
	import HoverCardArrow from '../../src/lib/components/hover-card/HoverCardArrow.svelte';
	import HoverCardBody from '../../src/lib/components/hover-card/HoverCardBody.svelte';
	import HoverCardContent from '../../src/lib/components/hover-card/HoverCardContent.svelte';
	import HoverCardPositioner from '../../src/lib/components/hover-card/HoverCardPositioner.svelte';
	import HoverCardTrigger from '../../src/lib/components/hover-card/HoverCardTrigger.svelte';
	import type { HoverCardOpenChangeDetails, UseHoverCardProps } from '../../src/lib/components/hover-card';

	let {
		open = $bindable(undefined),
		defaultOpen = undefined,
		openDelay = undefined,
		closeDelay = undefined,
		disabled = undefined,
		positioning = undefined,
		portalled = undefined,
		withBody = false,
		onOpenChange = undefined
	}: {
		open?: boolean;
		defaultOpen?: boolean;
		openDelay?: number;
		closeDelay?: number;
		disabled?: boolean;
		positioning?: UseHoverCardProps['positioning'];
		portalled?: boolean;
		withBody?: boolean;
		onOpenChange?: (details: HoverCardOpenChangeDetails) => void;
	} = $props();
</script>

<HoverCard
	{open}
	{defaultOpen}
	{openDelay}
	{closeDelay}
	{disabled}
	{positioning}
	{portalled}
	{onOpenChange}
>
	<HoverCardTrigger>@sveltejs</HoverCardTrigger>
	<HoverCardPositioner>
		<HoverCardContent>
			<HoverCardArrow />
			{#if withBody}
				<HoverCardBody>Svelte is a compiler-first UI framework.</HoverCardBody>
			{:else}
				<p>Svelte is a compiler-first UI framework.</p>
			{/if}
		</HoverCardContent>
	</HoverCardPositioner>
</HoverCard>

<button type="button">Outside</button>
