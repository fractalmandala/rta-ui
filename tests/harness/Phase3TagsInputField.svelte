<script lang="ts">
	import {
		Field,
		FieldErrorText,
		FieldHelperText,
		FieldLabel,
		FieldRequiredIndicator
	} from '../../src/lib/components/field/index';
	import {
		TagsInput,
		TagsInputControl,
		TagsInputHiddenInput,
		TagsInputInput,
		TagsInputItem,
		TagsInputItemDeleteTrigger,
		TagsInputItemInput,
		TagsInputItemPreview,
		TagsInputItemText
	} from '../../src/lib/components/tags-input/index';

	let {
		value = $bindable(['a']),
		invalid = false,
		required = false,
		disabled = false,
		readOnly = false
	}: {
		value?: string[];
		invalid?: boolean;
		required?: boolean;
		disabled?: boolean;
		readOnly?: boolean;
	} = $props();
</script>

<Field id="tags-demo" {invalid} {required} {disabled} {readOnly}>
	<FieldLabel>Tags <FieldRequiredIndicator /></FieldLabel>
	<TagsInput bind:value>
		<TagsInputControl>
			{#each value as tag, index (tag)}
				<TagsInputItem {index} value={tag}>
					<TagsInputItemPreview>
						<TagsInputItemText>{tag}</TagsInputItemText>
						<TagsInputItemDeleteTrigger />
					</TagsInputItemPreview>
					<TagsInputItemInput />
				</TagsInputItem>
			{/each}
			<TagsInputInput />
		</TagsInputControl>
		<TagsInputHiddenInput name="tags" />
	</TagsInput>
	<FieldHelperText>Press Enter to add</FieldHelperText>
	<FieldErrorText>Required</FieldErrorText>
</Field>
