<script lang="ts">
	import {
		ScrollArea,
		ScrollAreaContent,
		ScrollAreaCorner,
		ScrollAreaScrollbar,
		ScrollAreaThumb,
		ScrollAreaViewport
	} from '../../lib/index';
</script>

<div style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr))">
	<ScrollArea fade style="height: 12rem; border: 1px solid var(--moduix-border); border-radius: 0.5rem">
		<ScrollAreaViewport>
			<ScrollAreaContent>
				<div style="padding: 1rem">
					{#each Array.from({ length: 20 }, (_, index) => index + 1) as row (row)}
						<p style="margin: 0 0 0.75rem">Row {row}</p>
					{/each}
				</div>
			</ScrollAreaContent>
		</ScrollAreaViewport>
		<ScrollAreaScrollbar orientation="vertical">
			<ScrollAreaThumb orientation="vertical" />
		</ScrollAreaScrollbar>
		<ScrollAreaCorner />
	</ScrollArea>

	<ScrollArea variant="always" style="height: 12rem; border: 1px solid var(--moduix-border); border-radius: 0.5rem">
		<ScrollAreaViewport>
			<ScrollAreaContent>
				<div style="display: flex; gap: 0.75rem; padding: 1rem; width: max-content">
					{#each Array.from({ length: 12 }, (_, index) => index + 1) as tile (tile)}
						<div
							style="width: 6rem; height: 8rem; border-radius: 0.5rem; background: var(--moduix-muted); display: grid; place-items: center"
						>
							{tile}
						</div>
					{/each}
				</div>
			</ScrollAreaContent>
		</ScrollAreaViewport>
		<ScrollAreaScrollbar orientation="horizontal">
			<ScrollAreaThumb orientation="horizontal" />
		</ScrollAreaScrollbar>
		<ScrollAreaCorner />
	</ScrollArea>
</div>
