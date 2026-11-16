<script lang="ts">
	import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '../../lib/index';
</script>

<Avatar size="lg">
	<AvatarImage src="https://i.pravatar.cc/120?img=12" alt="Ada Lovelace" />
	<AvatarFallback>AL</AvatarFallback>
</Avatar>

<AvatarGroup>
	{#each ['AL', 'GH', 'KL'] as initials (initials)}
		<Avatar>
			<AvatarFallback>{initials}</AvatarFallback>
		</Avatar>
	{/each}
</AvatarGroup>
