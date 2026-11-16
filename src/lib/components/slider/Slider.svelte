<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseSliderProps } from './slider.state.svelte';

	export interface SliderProps
		extends Omit<UseSliderProps, 'aria-label' | 'aria-labelledby'>,
			Omit<HTMLProps<'div'>, 'aria-label' | 'aria-labelledby'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		'aria-label'?: string | string[];
		'aria-labelledby'?: string | string[];
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Slider.module.css';
	import { createSlider, setSliderContext } from './slider.state.svelte';

	let {
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		asChild,
		children,
		class: className,
		defaultValue,
		dir,
		disabled,
		form,
		getAriaValueText,
		id,
		ids,
		invalid,
		largeStep,
		max,
		min,
		minStepsBetweenThumbs,
		name,
		onFocusChange,
		onValueChange,
		onValueChangeEnd,
		orientation,
		origin,
		readOnly,
		ref = $bindable(null),
		step,
		style,
		thumbAlignment,
		thumbCollisionBehavior,
		thumbSize,
		value = $bindable(),
		...props
	}: SliderProps = $props();

	const uid = $props.id();
	const api = createSlider(
		() => ({
			'aria-label': ariaLabel,
			'aria-labelledby': ariaLabelledBy,
			defaultValue,
			dir,
			disabled,
			form,
			getAriaValueText,
			id,
			ids,
			invalid,
			largeStep,
			max,
			min,
			minStepsBetweenThumbs,
			name,
			onFocusChange,
			onValueChange: (details) => {
				onValueChange?.(details);
				if (value !== undefined) value = details.value;
			},
			onValueChangeEnd,
			orientation,
			origin,
			readOnly,
			step,
			thumbAlignment,
			thumbCollisionBehavior,
			thumbSize,
			value
		}),
		uid
	);

	setSliderContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="slider"
	data-part="root"
	data-slot="slider-root"
	class={cn(styles.root, className)}
	style={mergeStyleDeclarations(attrs.style, style)}
>
	{@render children?.()}
</Element>
