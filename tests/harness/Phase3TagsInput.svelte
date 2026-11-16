<script lang="ts">
	import {
		TagsInput,
		TagsInputClearTrigger,
		TagsInputControl,
		TagsInputHiddenInput,
		TagsInputInput,
		TagsInputItem,
		TagsInputItemDeleteTrigger,
		TagsInputItemInput,
		TagsInputItemPreview,
		TagsInputItemText,
		TagsInputLabel
	} from '../../src/lib/components/tags-input/index';

	let {
		value = $bindable(['a', 'b', 'c']),
		inputValue = $bindable(''),
		onValueChange,
		...rest
	}: {
		value?: string[];
		inputValue?: string;
		onValueChange?: (next: string[]) => void;
		[key: string]: unknown;
	} = $props();
</script>

<TagsInput
	bind:value
	bind:inputValue
	onValueChange={(details) => onValueChange?.(details.value)}
	{...rest}
>
	<TagsInputLabel>Tags</TagsInputLabel>
	<TagsInputControl>
		{#each value as tag, index (`${tag}-${index}`)}
			<TagsInputItem {index} value={tag}>
				<TagsInputItemPreview>
					<TagsInputItemText>{tag}</TagsInputItemText>
					<TagsInputItemDeleteTrigger />
				</TagsInputItemPreview>
				<TagsInputItemInput />
			</TagsInputItem>
		{/each}
		<TagsInputInput placeholder="Add tag" />
		<TagsInputClearTrigger />
	</TagsInputControl>
	<TagsInputHiddenInput name="tags" />
</TagsInput>
