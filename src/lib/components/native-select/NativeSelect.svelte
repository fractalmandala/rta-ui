<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLProps } from '../../internal/types';

	export interface NativeSelectProps extends Omit<HTMLProps<'select'>, 'value'> {
		value?: string | string[];
		controlProps?: HTMLProps<'span'>;
		ref?: HTMLSelectElement | null;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { cn } from '../../internal/cn.js';
	import { mergeProps } from '../../internal/mergeProps.js';
	import styles from './NativeSelect.module.css';
	import { useFieldContext } from '../field/field.state.svelte';

	let {
		children,
		class: className,
		controlProps,
		multiple,
		ref = $bindable(null),
		value = $bindable(),
		...props
	}: NativeSelectProps = $props();

	const field = useFieldContext();
	const { class: controlClassName, ...controlRest } = $derived(controlProps ?? {});

	function handleInput(event: Event) {
		const target = event.currentTarget as HTMLSelectElement;
		value = multiple
			? Array.from(target.selectedOptions).map((option) => option.value)
			: target.value;
	}

	const selectAttrs = $derived(
		mergeProps(field?.selectAttrs() ?? {}, { value, multiple, oninput: handleInput }, props)
	);
</script>

<span
	{...controlRest}
	class={cn(styles.control, controlClassName)}
	data-scope="native-select"
	data-part="control"
	data-slot="native-select-control"
>
	<select
		{...selectAttrs}
		bind:this={ref}
		class={cn(styles.root, className)}
		data-scope="field"
		data-part="select"
		data-slot="native-select-root"
	>
		{@render children?.()}
	</select>
	<span
		aria-hidden="true"
		class={styles.indicator}
		data-scope="native-select"
		data-part="indicator"
		data-slot="native-select-indicator"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			focusable="false"
		><path d="m6 9 6 6 6-6" /></svg>
	</span>
</span>
