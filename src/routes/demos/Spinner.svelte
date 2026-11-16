<script lang="ts">
  import { Button, Spinner } from '../../lib/index';
</script>

<div class="row">
  <Spinner size="xs" />
  <Spinner size="sm" />
  <Spinner size="md" />
  <Spinner size="lg" />
  <Spinner size="xl" />
  <Button loading>
    <Spinner size="sm" decorative />
    Saving
  </Button>
</div>

<style>
  .row {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }
</style>
