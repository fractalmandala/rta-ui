<script lang="ts">
  import { CloseButton } from '../../lib/index';
</script>

<div class="row">
  <CloseButton />
  <CloseButton disabled />
  <CloseButton aria-label="Dismiss banner" />
</div>

<style>
  .row {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
</style>
