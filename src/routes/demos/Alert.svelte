<script lang="ts">
  import { Alert } from '../../lib/index';
</script>

<div class="stack">
  <Alert status="info">A new version is available.</Alert>
  <Alert status="success">Your changes were saved.</Alert>
  <Alert status="warning">This action cannot be undone.</Alert>
  <Alert status="error">The connection was refused.</Alert>
</div>

<style>
  .stack {
    display: grid;
    gap: 0.5rem;
  }
</style>
