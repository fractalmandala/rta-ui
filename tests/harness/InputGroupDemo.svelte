<script lang="ts">
  import InputGroup from '../../src/lib/components/input-group/InputGroup.svelte';
  import InputGroupAddon from '../../src/lib/components/input-group/InputGroupAddon.svelte';
  import InputGroupClearTrigger from '../../src/lib/components/input-group/InputGroupClearTrigger.svelte';
  import InputGroupInput from '../../src/lib/components/input-group/InputGroupInput.svelte';
  import InputGroupText from '../../src/lib/components/input-group/InputGroupText.svelte';

  import type { InputSize } from '../../src/lib/components/input/Input.svelte';

  let { size = 'md' as InputSize, showTrigger = true } = $props();
</script>

<InputGroup {size}>
  <InputGroupAddon align="inline">
    <InputGroupText>$</InputGroupText>
  </InputGroupAddon>
  <InputGroupInput placeholder="Amount" />
  {#if showTrigger}
    <InputGroupClearTrigger />
  {/if}
</InputGroup>
