<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ColorFormat } from './color.js';

	export const colorPickerFormats: ColorFormat[] = ['rgba', 'hsla', 'hsba'];

	export interface ColorPickerFormatSelectProps
		extends Omit<HTMLProps<'select'>, 'value'>,
			PolymorphicProps<'select'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './ColorPicker.module.css';
	import { useColorPickerContext } from './color-picker.state.svelte';

	let {
		asChild,
		class: className,
		onchange,
		ref = $bindable(null),
		...props
	}: ColorPickerFormatSelectProps = $props();

	const api = useColorPickerContext();
</script>

<span class={styles.formatSelectControl}>
	<Element
		as="select"
		{...props}
		bind:ref
		{asChild}
		aria-label="change color format"
		dir={api.dir}
		value={api.format}
		disabled={api.disabled}
		data-scope="color-picker"
		data-part="format-select"
		data-slot="color-picker-format-select"
		class={cn(styles.formatSelect, className)}
		onchange={(event) => {
			onchange?.(event);
			if (event.defaultPrevented) return;
			api.onFormatSelectChange(event);
		}}
	>
		{#each colorPickerFormats as option (option)}
			<option value={option}>{option}</option>
		{/each}
	</Element>
	<span aria-hidden="true" class={styles.formatSelectIndicator}>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="m6 9 6 6 6-6" />
		</svg>
	</span>
</span>
