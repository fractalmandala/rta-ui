<script lang="ts">
  import { Tag, TagCloseTrigger, TagLabel, TagStartElement } from '../../lib/index';
</script>

<div class="row">
  <Tag>
    <TagStartElement>#</TagStartElement>
    <TagLabel>design</TagLabel>
  </Tag>
  <Tag variant="secondary">
    <TagLabel>svelte</TagLabel>
    <TagCloseTrigger />
  </Tag>
  <Tag variant="outline" size="sm">
    <TagLabel>css</TagLabel>
    <TagCloseTrigger />
  </Tag>
</div>

<style>
  .row {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
  }
</style>
