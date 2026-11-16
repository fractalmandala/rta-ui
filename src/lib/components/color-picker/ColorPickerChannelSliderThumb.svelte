<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ColorPickerChannelSliderThumbProps
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
	import { useColorPickerChannelContext, useColorPickerContext } from './color-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		onfocus,
		onkeydown,
		ref = $bindable(null),
		...props
	}: ColorPickerChannelSliderThumbProps = $props();

	const api = useColorPickerContext();
	const channel = useColorPickerChannelContext();
	const orientation = $derived(channel.orientation ?? 'horizontal');
	const range = $derived(api.channelSliderThumbRange(channel.channel, { format: channel.format }));
	const thumbStyle = $derived(
		api.channelSliderThumbStyle(channel.channel, { orientation, format: channel.format })
	);
	const label = $derived(channel.channel);

	$effect(() => {
		api.setChannelSliderThumbNode(channel.channel, ref as HTMLElement | null);
		return () => api.setChannelSliderThumbNode(channel.channel, null);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.channelSliderThumbId(channel.channel)}
	role="slider"
	aria-label={label}
	tabindex={api.disabled ? undefined : 0}
	data-scope="color-picker"
	data-part="channel-slider-thumb"
	data-channel={channel.channel}
	data-disabled={dataAttr(api.disabled)}
	data-orientation={orientation}
	aria-disabled={api.disabled ? true : undefined}
	aria-orientation={orientation}
	aria-valuemax={range.maxValue}
	aria-valuemin={range.minValue}
	aria-valuenow={range.value}
	aria-valuetext="{label} {range.value}"
	style={mergeStyleDeclarations(thumbStyle, props.style)}
	data-slot="color-picker-channel-slider-thumb"
	class={cn(styles.thumb, className)}
	onfocus={(event) => {
		onfocus?.(event);
		if (event.defaultPrevented) return;
		api.onChannelSliderThumbFocus(channel.channel);
	}}
	onkeydown={(event) => {
		onkeydown?.(event);
		if (event.defaultPrevented) return;
		api.onChannelSliderThumbKeyDown(event, channel.channel, {
			orientation,
			format: channel.format
		});
	}}
>
	{@render children?.()}
</Element>
