<script lang="ts">
	import {
		Marquee,
		MarqueeContent,
		MarqueeItem,
		MarqueeViewport
	} from '../../src/lib/components/marquee/index.js';

	let { pauseOnInteraction = undefined, paused = undefined, side = undefined } = $props();
</script>

<Marquee {pauseOnInteraction} {paused} {side}>
	<MarqueeViewport>
		{#each [0, 1] as index (index)}
			<MarqueeContent {index}>
				<MarqueeItem>alpha</MarqueeItem>
				<MarqueeItem>beta</MarqueeItem>
			</MarqueeContent>
		{/each}
	</MarqueeViewport>
</Marquee>
