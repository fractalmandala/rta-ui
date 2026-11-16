<script lang="ts">
  import {
    Button,
    Empty,
    EmptyActions,
    EmptyContent,
    EmptyDescription,
    EmptyIcon,
    EmptyTitle,
  } from '../../lib/index';
</script>

<Empty>
  <EmptyContent>
    <EmptyIcon>◍</EmptyIcon>
    <EmptyTitle>No results</EmptyTitle>
    <EmptyDescription>Try a different search term or clear the filters.</EmptyDescription>
  </EmptyContent>
  <EmptyActions>
    <Button size="sm" variant="outline">Clear filters</Button>
  </EmptyActions>
</Empty>
