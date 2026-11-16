<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { PropsFn } from '../../src/lib/internal/types';
	import {
		Editable,
		EditableArea,
		EditableControls,
		EditableInput,
		EditableLabel,
		EditablePreview,
		type EditableActivationMode,
		type EditableEditChangeDetails,
		type EditablePlaceholder,
		type EditableSubmitMode,
		type EditableValueChangeDetails
	} from '../../src/lib/components/editable/index';

	let {
		value = $bindable('Draft copy'),
		activationMode = 'dblclick',
		submitMode = 'both',
		placeholder,
		disabled = false,
		readOnly = false,
		autoResize = false,
		textarea = false,
		maxLength,
		onValueChange,
		onValueCommit,
		onValueRevert,
		onEditChange
	}: {
		value?: string;
		activationMode?: EditableActivationMode;
		submitMode?: EditableSubmitMode;
		placeholder?: string | EditablePlaceholder;
		disabled?: boolean;
		readOnly?: boolean;
		autoResize?: boolean;
		textarea?: boolean;
		maxLength?: number;
		onValueChange?: (details: EditableValueChangeDetails) => void;
		onValueCommit?: (details: EditableValueChangeDetails) => void;
		onValueRevert?: (details: EditableValueChangeDetails) => void;
		onEditChange?: (details: EditableEditChangeDetails) => void;
	} = $props();
</script>

{#snippet asChild(merge: PropsFn<'input'>)}
	{@const merged = merge() as HTMLTextareaAttributes}
	<textarea {...merged} rows="2"></textarea>
{/snippet}

<Editable
	bind:value
	{activationMode}
	{submitMode}
	{placeholder}
	{disabled}
	{readOnly}
	{autoResize}
	{maxLength}
	{onValueChange}
	{onValueCommit}
	{onValueRevert}
	{onEditChange}
>
	<EditableLabel>Task</EditableLabel>
	<EditableArea>
		<EditablePreview />
		{#if textarea}
			<EditableInput {asChild} />
		{:else}
			<EditableInput />
		{/if}
	</EditableArea>
	<EditableControls />
</Editable>
