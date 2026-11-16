<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseTagsInputProps } from './tags-input.state.svelte';

	export interface TagsInputRootProps
		extends UseTagsInputProps,
			Omit<HTMLProps<'div'>, 'placeholder'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './TagsInput.module.css';
	import { createTagsInput, setTagsInputContext } from './tags-input.state.svelte';

	let {
		addOnPaste,
		allowDuplicates,
		allowOverflow,
		asChild,
		autoFocus,
		blurBehavior,
		children,
		class: className,
		defaultInputValue,
		defaultValue,
		delimiter,
		dir,
		disabled,
		editable,
		form,
		id,
		ids,
		inputValue = $bindable(),
		invalid,
		max,
		maxLength,
		name,
		onHighlightChange,
		onInputValueChange,
		onValueChange,
		onValueInvalid,
		placeholder,
		readOnly,
		ref = $bindable(null),
		required,
		sanitizeValue,
		translations,
		validate,
		value = $bindable(),
		...props
	}: TagsInputRootProps = $props();

	const uid = $props.id();

	const api = createTagsInput(
		() => ({
			addOnPaste,
			allowDuplicates,
			allowOverflow,
			autoFocus,
			blurBehavior,
			defaultInputValue,
			defaultValue,
			delimiter,
			dir,
			disabled,
			editable,
			form,
			id,
			ids,
			inputValue,
			invalid,
			max,
			maxLength,
			name,
			onHighlightChange,
			onValueInvalid,
			placeholder,
			readOnly,
			required,
			sanitizeValue,
			translations,
			validate,
			value,
			onValueChange(details) {
				onValueChange?.(details);
				value = details.value;
			},
			onInputValueChange(details) {
				onInputValueChange?.(details);
				inputValue = details.inputValue;
			}
		}),
		uid
	);

	setTagsInputContext(api);

	const attrs = $derived(api.rootAttrs());

	$effect(() => {
		api.registerRoot(ref);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="tags-input"
	data-part="root"
	data-slot="tags-input-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
