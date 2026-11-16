<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseNumberInputProps } from './number-input.state.svelte';

	export type NumberInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

	export interface NumberInputRootProps
		extends UseNumberInputProps,
			Omit<HTMLProps<'div'>, 'size'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		size?: NumberInputSize;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './NumberInput.module.css';
	import {
		createNumberInput,
		setNumberInputContext
	} from './number-input.state.svelte';

	let {
		allowMouseWheel,
		allowOverflow,
		asChild,
		children,
		clampValueOnBlur,
		class: className,
		defaultValue,
		dir,
		disabled,
		focusInputOnChange,
		form,
		formatOptions,
		id,
		ids,
		inputMode,
		invalid,
		largeStep,
		locale,
		max,
		min,
		name,
		pattern,
		readOnly,
		ref = $bindable(null),
		required,
		size = 'md',
		smallStep,
		spinOnPress,
		step,
		translations,
		value = $bindable(),
		...props
	}: NumberInputRootProps = $props();

	const uid = $props.id();
	const api = createNumberInput(
		() => ({
			...props,
			allowMouseWheel,
			allowOverflow,
			clampValueOnBlur,
			defaultValue,
			dir,
			disabled,
			focusInputOnChange,
			form,
			formatOptions,
			id,
			ids,
			inputMode,
			invalid,
			largeStep,
			locale,
			max,
			min,
			name,
			pattern,
			readOnly,
			required,
			smallStep,
			spinOnPress,
			step,
			translations,
			value,
			onValueChange(details) {
				props.onValueChange?.(details);
				if (value !== undefined) value = details.value;
			}
		}),
		uid
	);
	setNumberInputContext(api);

	const attrs = $derived(api.rootAttrs());

	$effect(() => {
		api.registerRoot(ref);
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="number-input"
	data-part="root"
	data-slot="number-input-root"
	data-size={size}
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
