<script lang="ts">
	import {
		TagsInput,
		TagsInputClearTrigger,
		TagsInputControl,
		TagsInputHiddenInput,
		TagsInputInput,
		TagsInputItems,
		TagsInputLabel
	} from '../../lib/components/tags-input/index';

	let value = $state<string[]>(['design', 'svelte']);
	let inputValue = $state('');
</script>

<p>Values: {value.join(', ') || '—'} — typing: {inputValue || '—'}</p>

<TagsInput bind:value bind:inputValue placeholder="Add a topic" blurBehavior="add">
	<TagsInputLabel>Topics</TagsInputLabel>
	<TagsInputControl>
		<TagsInputItems />
		<TagsInputInput />
		<TagsInputClearTrigger />
	</TagsInputControl>
	<TagsInputHiddenInput name="topics" />
</TagsInput>
