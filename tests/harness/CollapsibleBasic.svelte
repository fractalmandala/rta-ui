<script lang="ts">
  import Collapsible from '../../src/lib/components/collapsible/Collapsible.svelte';
  import CollapsibleTrigger from '../../src/lib/components/collapsible/CollapsibleTrigger.svelte';
  import CollapsibleContent from '../../src/lib/components/collapsible/CollapsibleContent.svelte';
  import CollapsibleIndicator from '../../src/lib/components/collapsible/CollapsibleIndicator.svelte';
  import CollapsibleBody from '../../src/lib/components/collapsible/CollapsibleBody.svelte';

  let {
    open = undefined,
    defaultOpen = undefined,
    collapsedHeight = undefined,
    onOpenChange = undefined,
    disabled = undefined
  } = $props();
</script>

<Collapsible {open} {defaultOpen} {collapsedHeight} {onOpenChange} {disabled}>
  <CollapsibleTrigger>
    Details
    <CollapsibleIndicator />
  </CollapsibleTrigger>
  <CollapsibleContent>
    <CollapsibleBody>Hidden copy</CollapsibleBody>
  </CollapsibleContent>
</Collapsible>
