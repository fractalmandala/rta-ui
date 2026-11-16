<script lang="ts">
  import { Separator } from '../../lib/index';
</script>

<div>
  <p>Above</p>
  <Separator />
  <p>Below</p>
</div>
<div class="row">
  <span>Left</span>
  <Separator orientation="vertical" />
  <span>Right</span>
</div>

<style>
  .row {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    height: 2rem;
    margin-top: 1rem;
  }
</style>
