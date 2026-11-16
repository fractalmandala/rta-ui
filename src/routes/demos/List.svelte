<script lang="ts">
  import { List, ListIndicator, ListItem } from '../../lib/index';
</script>

<List tone="muted">
  <ListItem>
    <ListIndicator />
    Zero runtime dependencies
  </ListItem>
  <ListItem>
    <ListIndicator />
    Ark-compatible data attributes
  </ListItem>
  <ListItem>
    <ListIndicator />
    CSS Modules keyed on parts
  </ListItem>
</List>

<div class="spaced">
  <List as="ol" marker="decimal" size="sm">
    <ListItem>First</ListItem>
    <ListItem>Second</ListItem>
  </List>
</div>

<style>
  .spaced {
    margin-top: 1rem;
  }
</style>
