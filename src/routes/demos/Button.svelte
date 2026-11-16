<script lang="ts">
  import { Button } from '../../lib/index';
</script>

<div class="row">
  <Button>Default</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="destructive">Delete</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="link">Link</Button>
</div>
<div class="row">
  <Button size="xs">xs</Button>
  <Button size="sm">sm</Button>
  <Button size="md">md</Button>
  <Button size="lg">lg</Button>
  <Button size="xl">xl</Button>
  <Button loading>Saving</Button>
  <Button disabled>Disabled</Button>
</div>

<style>
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  }
  .row + .row {
    margin-top: 0.75rem;
  }
</style>
