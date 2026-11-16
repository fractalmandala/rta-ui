<script lang="ts">
  import { Image, ImageSource } from '../../lib/index';
</script>

<div class="grid">
  <Image
    src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800"
    alt="Snowy mountain ridge at dusk"
    layout="constrained"
  />
  <Image
    src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400"
    alt="A quiet beach"
    layout="fixed"
    width={200}
    height={200}
  />
</div>

<picture>
  <ImageSource srcset="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800 1x" />
  <Image src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800" alt="Fog" />
</picture>

<style>
  .grid {
    display: grid;
    gap: 1rem;
    max-width: 40rem;
  }
</style>
