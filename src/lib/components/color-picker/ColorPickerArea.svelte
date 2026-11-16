<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ColorChannel } from './color.js';

	export interface ColorPickerAreaProps
		extends Omit<HTMLProps<'div'>, 'role'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		/** Channel driven by the horizontal axis. Defaults to the format's second channel. */
		xChannel?: ColorChannel;
		/** Channel driven by the vertical axis. Defaults to the format's third channel. */
		yChannel?: ColorChannel;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './ColorPicker.module.css';
	import ColorPickerAreaBackground from './ColorPickerAreaBackground.svelte';
	import ColorPickerAreaThumb from './ColorPickerAreaThumb.svelte';
	import { setColorPickerAreaContext, useColorPickerContext } from './color-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onpointerdown,
		ref = $bindable(null),
		xChannel,
		yChannel,
		...props
	}: ColorPickerAreaProps = $props();

	const api = useColorPickerContext();
	const channels = $derived({ xChannel, yChannel });
	const areaStyle = $derived(api.areaStyle(channels));

	setColorPickerAreaContext({
		get xChannel() {
			return xChannel;
		},
		get yChannel() {
			return yChannel;
		}
	});

	$effect(() => {
		api.setAreaNode(ref as HTMLElement | null);
		return () => api.setAreaNode(null);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.areaId}
	role="group"
	data-scope="color-picker"
	data-part="area"
	data-invalid={dataAttr(api.invalid)}
	data-disabled={dataAttr(api.disabled)}
	data-readonly={dataAttr(api.readOnly)}
	style={mergeStyleDeclarations(areaStyle, props.style)}
	data-slot="color-picker-area"
	class={cn(styles.area, className)}
	onpointerdown={(event) => {
		onpointerdown?.(event);
		if (event.defaultPrevented) return;
		api.onAreaPointerDown(event, channels);
	}}
>
	{#if children}
		{@render children()}
	{:else}
		<ColorPickerAreaBackground />
		<ColorPickerAreaThumb />
	{/if}
</Element>
