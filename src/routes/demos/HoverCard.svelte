<script lang="ts">
	import {
		HoverCard,
		HoverCardArrow,
		HoverCardBody,
		HoverCardContent,
		HoverCardPositioner,
		HoverCardTrigger
	} from '../../lib/components/hover-card/index';
</script>

<p>
	Built by
	<HoverCard openDelay={300} closeDelay={200} positioning={{ placement: 'bottom-start' }}>
		<HoverCardTrigger>@sveltejs</HoverCardTrigger>
		<HoverCardPositioner>
			<HoverCardContent>
				<HoverCardArrow />
				<HoverCardBody>
					<strong>Svelte</strong>
					<br />
					Cybernetically enhanced web apps. Hovering onto the card keeps it open.
				</HoverCardBody>
			</HoverCardContent>
		</HoverCardPositioner>
	</HoverCard>
	in Switzerland.
</p>
