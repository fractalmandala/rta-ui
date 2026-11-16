<script module lang="ts">
	import type { EditableControlProps } from './EditableControl.svelte';

	export interface EditableControlsProps
		extends Omit<EditableControlProps, 'asChild' | 'children'> {}
</script>

<script lang="ts">
	import EditableCancelTrigger from './EditableCancelTrigger.svelte';
	import EditableControl from './EditableControl.svelte';
	import EditableEditTrigger from './EditableEditTrigger.svelte';
	import EditableSubmitTrigger from './EditableSubmitTrigger.svelte';
	import { useEditableContext } from './editable.state.svelte';

	let { ref = $bindable(null), ...props }: EditableControlsProps = $props();

	const api = useEditableContext();
</script>

<EditableControl {...props} bind:ref>
	{#if api.editing}
		<EditableSubmitTrigger />
		<EditableCancelTrigger />
	{:else}
		<EditableEditTrigger />
	{/if}
</EditableControl>
