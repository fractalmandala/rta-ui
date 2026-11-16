<script lang="ts">
	import { Marquee, MarqueeContent, MarqueeItem, MarqueeViewport } from '../../lib/index';
</script>

<Marquee speed={40} pauseOnInteraction>
	<MarqueeViewport>
		{#each [0, 1] as index (index)}
			<MarqueeContent {index}>
				{#each ['Svelte 5', 'Runes', 'CSS Modules', 'Zero dependencies'] as item (item)}
					<MarqueeItem>{item}</MarqueeItem>
				{/each}
			</MarqueeContent>
		{/each}
	</MarqueeViewport>
</Marquee>
