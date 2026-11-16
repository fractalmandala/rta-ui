<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseDateInputProps } from './date-input.state.svelte';

	export interface DateInputRootBaseProps
		extends UseDateInputProps,
			PolymorphicProps<'div'>,
			RefAttribute {}

	export interface DateInputRootProps
		extends DateInputRootBaseProps,
			HTMLProps<'div'> {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './DateInput.module.css';
	import { createDateInput, setDateInputContext } from './date-input.state.svelte';

	let {
		asChild,
		children,
		class: className,
		defaultValue,
		dir,
		disabled,
		form,
		id,
		ids,
		invalid,
		isDateUnavailable,
		locale,
		max,
		min,
		name,
		onFocusChange,
		onPlaceholderChange,
		onValueChange,
		placeholderValue = $bindable(),
		readOnly,
		ref = $bindable(null),
		required,
		selectionMode,
		timeZone,
		translations,
		value = $bindable(),
		...props
	}: DateInputRootProps = $props();

	const uid = $props.id();

	const api = createDateInput(
		() => ({
			...props,
			defaultValue,
			dir,
			disabled,
			form,
			id,
			ids,
			invalid,
			isDateUnavailable,
			locale,
			max,
			min,
			name,
			readOnly,
			required,
			selectionMode,
			timeZone,
			translations,
			placeholderValue,
			value,
			onFocusChange,
			onValueChange(details) {
				onValueChange?.(details);
				if (value === undefined) return;
				value = typeof value === 'string' ? details.valueAsString[0] ?? '' : details.value;
			},
			onPlaceholderChange(details) {
				onPlaceholderChange?.(details);
				if (placeholderValue !== undefined) placeholderValue = details.placeholderValue;
			}
		}),
		uid
	);
	setDateInputContext(api);
</script>

<Element
	as="div"
	{...props}
	{...api.getRootProps()}
	bind:ref
	{asChild}
	data-scope="date-input"
	data-part="root"
	data-slot="date-input-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
