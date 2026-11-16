<script module lang="ts">
	import type { SliderThumbProps } from './SliderThumb.svelte';

	export interface SliderThumbsProps {
		class?: SliderThumbProps['class'];
	}
</script>

<script lang="ts">
	import SliderHiddenInput from './SliderHiddenInput.svelte';
	import SliderThumb from './SliderThumb.svelte';
	import { useSliderContext } from './slider.state.svelte';

	let { class: className }: SliderThumbsProps = $props();

	const api = useSliderContext();
</script>

{#each api.value as _, index (index)}
	<SliderThumb class={className} {index}>
		<SliderHiddenInput />
	</SliderThumb>
{/each}
