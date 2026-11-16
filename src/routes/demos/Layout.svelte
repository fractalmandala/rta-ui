<script lang="ts">
  import {
    AspectRatio,
    Bleed,
    Container,
    Heading,
    SimpleGrid,
    Stack,
    Text,
  } from '../../lib/index';
</script>

<Container size="md">
  <Stack gap="4">
    <Heading as="h2">Layout primitives</Heading>
    <Text tone="muted">Every primitive is a single element with token-driven spacing.</Text>
    <SimpleGrid columns={2} gap="4">
      <div class="tile"><AspectRatio ratio={16 / 9}>16 : 9</AspectRatio></div>
      <div class="tile"><AspectRatio ratio={1}>1 : 1</AspectRatio></div>
    </SimpleGrid>
    <Bleed inline="md">
      <div class="band">Full-bleed band inside a container</div>
    </Bleed>
  </Stack>
</Container>

<style>
  .tile {
    display: grid;
    place-items: center;
    border: 1px solid var(--moduix-border);
    border-radius: 0.5rem;
    font-size: 0.75rem;
  }
  .band {
    padding: 0.75rem 1rem;
    background: var(--moduix-muted);
    border-radius: 0.5rem;
  }
</style>
