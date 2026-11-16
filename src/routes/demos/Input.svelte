<script lang="ts">
  import { Input, Textarea } from '../../lib/index';

  let name = $state('Amrit');
  let bio = $state('Svelte, CSS, and a little Rust.');
</script>

<div class="stack">
  <label class="field">
    <span>Name</span>
    <Input bind:value={name} placeholder="Name" />
  </label>
  <label class="field">
    <span>Read only</span>
    <Input value="read only" readonly size="sm" />
  </label>
  <label class="field">
    <span>Invalid</span>
    <Input value="invalid" aria-invalid="true" />
  </label>
  <label class="field">
    <span>Bio</span>
    <Textarea bind:value={bio} rows={3} placeholder="Bio" />
  </label>
  <p class="echo">{name} · {bio}</p>
</div>

<style>
  .stack {
    display: grid;
    gap: 0.75rem;
    max-width: 22rem;
  }
  .field {
    display: grid;
    gap: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
  }
  .echo {
    font-size: 0.75rem;
    color: var(--moduix-muted-foreground);
  }
</style>
