<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ColorPickerAreaThumbProps
		extends Omit<HTMLProps<'div'>, 'role'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './ColorPicker.module.css';
	import { useColorPickerAreaContext, useColorPickerContext } from './color-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onfocus,
		onkeydown,
		ref = $bindable(null),
		...props
	}: ColorPickerAreaThumbProps = $props();

	const api = useColorPickerContext();
	const area = useColorPickerAreaContext();
	const channels = $derived(api.areaChannels(area));
	const thumbStyle = $derived(api.areaThumbStyle(area));
	const xValue = $derived(api.areaThumbXValue(area));
	const yValue = $derived(api.areaThumbYValue(area));

	$effect(() => {
		api.setAreaThumbNode(ref as HTMLElement | null);
		return () => api.setAreaThumbNode(null);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.areaThumbId}
	dir={api.dir}
	role="slider"
	tabindex={api.disabled ? undefined : 0}
	aria-disabled={api.disabled ? true : undefined}
	aria-valuemin={0}
	aria-valuemax={100}
	aria-valuenow={xValue}
	aria-label="{channels.xChannel} and {channels.yChannel}"
	aria-roledescription="2d slider"
	aria-valuetext="{channels.xChannel} {xValue}, {channels.yChannel} {yValue}"
	data-scope="color-picker"
	data-part="area-thumb"
	data-disabled={dataAttr(api.disabled)}
	data-invalid={dataAttr(api.invalid)}
	data-readonly={dataAttr(api.readOnly)}
	style={mergeStyleDeclarations(thumbStyle, props.style)}
	data-slot="color-picker-area-thumb"
	class={cn(styles.thumb, className)}
	onfocus={(event) => {
		onfocus?.(event);
		if (event.defaultPrevented) return;
		api.onAreaThumbFocus(area);
	}}
	onkeydown={(event) => {
		onkeydown?.(event);
		if (event.defaultPrevented) return;
		api.onAreaThumbKeyDown(event, area);
	}}
>
	{@render children?.()}
</Element>
