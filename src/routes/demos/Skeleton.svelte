<script lang="ts">
  import { Skeleton } from '../../lib/index';
</script>

<div class="card">
  <Skeleton width={48} height={48} borderRadius="50%" />
  <div class="lines">
    <Skeleton width="60%" height={14} />
    <Skeleton width="90%" height={14} />
    <Skeleton width="40%" height={14} />
  </div>
</div>

<style>
  .card {
    display: flex;
    gap: 0.75rem;
    padding: 1rem;
    border: 1px solid var(--moduix-border);
    border-radius: 0.75rem;
  }
  .lines {
    display: grid;
    gap: 0.5rem;
    flex: 1;
  }
</style>
