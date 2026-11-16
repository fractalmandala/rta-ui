<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseAngleSliderProps } from './angle-slider.state.svelte';

	export interface AngleSliderProps
		extends Omit<UseAngleSliderProps, 'aria-label' | 'aria-labelledby'>,
			Omit<HTMLProps<'div'>, 'aria-label' | 'aria-labelledby'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		'aria-label'?: string;
		'aria-labelledby'?: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './AngleSlider.module.css';
	import { createAngleSlider, setAngleSliderContext } from './angle-slider.state.svelte';

	let {
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		asChild,
		children,
		class: className,
		defaultValue,
		dir,
		disabled,
		id,
		ids,
		invalid,
		name,
		onValueChange,
		onValueChangeEnd,
		readOnly,
		ref = $bindable(null),
		step,
		style,
		value = $bindable(),
		...props
	}: AngleSliderProps = $props();

	const uid = $props.id();

	const api = createAngleSlider(
		() => ({
			'aria-label': ariaLabel,
			'aria-labelledby': ariaLabelledBy,
			defaultValue,
			dir,
			disabled,
			id,
			ids,
			invalid,
			name,
			onValueChange: (details) => {
				onValueChange?.(details);
				if (value !== undefined) value = details.value;
			},
			onValueChangeEnd,
			readOnly,
			step,
			value
		}),
		uid
	);

	setAngleSliderContext(api);

	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="angle-slider"
	data-part="root"
	data-slot="angle-slider-root"
	class={cn(styles.root, className)}
	style={mergeStyleDeclarations(attrs.style, style)}
>
	{@render children?.()}
</Element>
