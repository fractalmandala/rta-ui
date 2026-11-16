<script lang="ts">
	import {
		Collapsible,
		CollapsibleContent,
		CollapsibleIndicator,
		CollapsibleTrigger
	} from '../../lib/index';
</script>

<Collapsible defaultOpen>
	<CollapsibleTrigger>
		What is rta ui?
		<CollapsibleIndicator />
	</CollapsibleTrigger>
	<CollapsibleContent>
		A dependency-free Svelte 5 component library with Ark-compatible data attributes.
	</CollapsibleContent>
</Collapsible>
