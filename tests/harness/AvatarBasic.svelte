<script lang="ts">
	import { Avatar, AvatarFallback, AvatarImage } from '../../src/lib/components/avatar/index.js';

	let { size = undefined } = $props();
</script>

<Avatar {size} data-testid="avatar">
	<AvatarImage src="https://example.com/a.png" alt="Ada" />
	<AvatarFallback>AL</AvatarFallback>
</Avatar>
