<script lang="ts">
	import { Pagination, PaginationItems, PaginationNextTrigger, PaginationPrevTrigger } from '../../lib/index';
</script>

<Pagination count={200} pageSize={10} siblingCount={2}>
	<PaginationPrevTrigger />
	<PaginationItems />
	<PaginationNextTrigger />
</Pagination>
