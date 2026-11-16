<script lang="ts">
  import {
    InputGroup,
    InputGroupAddon,
    InputGroupClearTrigger,
    InputGroupInput,
    InputGroupText,
  } from '../../lib/index';

  let amount = $state('42.00');
</script>

<div class="stack">
  <InputGroup size="md">
    <InputGroupAddon align="inline">
      <InputGroupText>$</InputGroupText>
    </InputGroupAddon>
    <InputGroupInput bind:value={amount} placeholder="0.00" aria-label="Amount" />
    <InputGroupAddon align="inline">
      <InputGroupText>USD</InputGroupText>
    </InputGroupAddon>
    <InputGroupAddon align="inline">
      <InputGroupClearTrigger onclick={() => (amount = '')} />
    </InputGroupAddon>
  </InputGroup>
  <InputGroup size="sm">
    <InputGroupInput placeholder="Compact group" aria-label="Compact group" />
  </InputGroup>
</div>

<style>
  .stack {
    display: grid;
    gap: 0.5rem;
    max-width: 22rem;
  }
</style>
