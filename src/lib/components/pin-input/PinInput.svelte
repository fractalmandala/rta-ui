<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UsePinInputProps } from './pin-input.state.svelte';

	export type PinInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

	export interface PinInputRootProps
		extends Omit<UsePinInputProps, 'placeholder'>,
			HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		size?: PinInputSize;
		placeholder?: string | undefined;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './PinInput.module.css';
	import { createPinInput, setPinInputContext } from './pin-input.state.svelte';

	let {
		asChild,
		autoFocus,
		autoSubmit,
		blurOnComplete,
		children,
		class: className,
		count,
		defaultValue,
		dir,
		disabled,
		form,
		id,
		ids,
		invalid,
		mask,
		name,
		onValueChange,
		onValueComplete,
		onValueInvalid,
		otp,
		pattern,
		placeholder = '',
		readOnly,
		ref = $bindable(null),
		required,
		sanitizeValue,
		selectOnFocus,
		size = 'md',
		translations,
		type,
		value = $bindable(),
		...props
	}: PinInputRootProps = $props();

	const uid = $props.id();
	const api = createPinInput(
		() => ({
			autoFocus,
			autoSubmit,
			blurOnComplete,
			count,
			defaultValue,
			dir,
			disabled,
			form,
			id,
			ids,
			invalid,
			mask,
			name,
			onValueChange(details) {
				onValueChange?.(details);
				if (value !== undefined) value = details.value;
			},
			onValueComplete,
			onValueInvalid,
			otp,
			pattern,
			placeholder,
			readOnly,
			required,
			sanitizeValue,
			selectOnFocus,
			translations,
			type,
			value
		}),
		uid
	);
	setPinInputContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="pin-input"
	data-part="root"
	data-size={size}
	data-slot="pin-input-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
