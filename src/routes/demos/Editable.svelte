<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { PropsFn } from '../../lib/internal/types';
	import {
		Editable,
		EditableArea,
		EditableControl,
		EditableControls,
		EditableEditTrigger,
		EditableInput,
		EditableLabel,
		EditablePreview
	} from '../../lib/index';

	let name = $state('Ada Lovelace');
	let commitCount = $state(0);
</script>

{#snippet asChild(merge: PropsFn<'input'>)}
	{@const merged = merge() as HTMLTextareaAttributes}
	<textarea {...merged} rows="2"></textarea>
{/snippet}

<Editable
	bind:value={name}
	activationMode="click"
	placeholder={{ preview: 'Add a name', edit: 'Type a name' }}
	maxLength={40}
	onValueCommit={() => (commitCount += 1)}
>
	<EditableLabel>Name</EditableLabel>
	<EditableArea>
		<EditablePreview />
		<EditableInput />
	</EditableArea>
	<EditableControls />
</Editable>

<p>Committed {commitCount} time{commitCount === 1 ? '' : 's'}: {name}</p>

<Editable activationMode="dblclick" submitMode="blur" defaultValue={'Line one\nLine two'} autoResize>
	<EditableLabel>Notes</EditableLabel>
	<EditableArea>
		<EditablePreview />
		<EditableInput {asChild} />
	</EditableArea>
</Editable>

<Editable defaultValue="Read only note" readOnly>
	<EditableLabel>Read only</EditableLabel>
	<EditableArea>
		<EditablePreview />
		<EditableInput />
	</EditableArea>
	<EditableControl>
		<EditableEditTrigger />
	</EditableControl>
</Editable>
