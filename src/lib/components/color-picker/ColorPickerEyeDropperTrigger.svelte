<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ColorPickerEyeDropperTriggerProps
		extends Omit<HTMLProps<'button'>, 'type'>,
			PolymorphicProps<'button'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import styles from './ColorPicker.module.css';
	import { useColorPickerContext } from './color-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onclick,
		ref = $bindable(null),
		...props
	}: ColorPickerEyeDropperTriggerProps = $props();

	const api = useColorPickerContext();
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	type="button"
	dir={api.dir}
	disabled={api.disabled}
	aria-label="Pick a color from the screen"
	data-scope="color-picker"
	data-part="eye-dropper-trigger"
	data-disabled={dataAttr(api.disabled)}
	data-invalid={dataAttr(api.invalid)}
	data-readonly={dataAttr(api.readOnly)}
	data-slot="color-picker-eye-dropper-trigger"
	class={cn(styles.eyeDropperTrigger, className)}
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		api.onEyeDropperClick();
	}}
>
	{#if children}
		{@render children()}
	{:else}
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="m2 22 1-1h3l9-9" />
			<path d="M3 21v-3l9-9" />
			<path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
		</svg>
	{/if}
</Element>
