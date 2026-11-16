<script lang="ts">
  import { Badge } from '../../lib/index';
</script>

<div class="row">
  <Badge>Default</Badge>
  <Badge variant="secondary">Secondary</Badge>
  <Badge variant="outline">Outline</Badge>
  <Badge variant="destructive">Destructive</Badge>
  <Badge size="sm">sm</Badge>
  <Badge size="lg">lg</Badge>
</div>

<style>
  .row {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
  }
</style>
