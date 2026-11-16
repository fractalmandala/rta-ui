<script module lang="ts">
	import type { AngleSliderControlProps } from './AngleSliderControl.svelte';

	export interface AngleSliderDialProps extends Omit<AngleSliderControlProps, 'asChild'> {
	}
</script>

<script lang="ts">
	import AngleSliderControl from './AngleSliderControl.svelte';
	import AngleSliderThumb from './AngleSliderThumb.svelte';
	import AngleSliderValueText from './AngleSliderValueText.svelte';

	let { children, ref = $bindable(null), ...props }: AngleSliderDialProps = $props();
</script>

<AngleSliderControl {...props} bind:ref>
	{@render children?.()}
	<AngleSliderValueText />
	<AngleSliderThumb />
</AngleSliderControl>
