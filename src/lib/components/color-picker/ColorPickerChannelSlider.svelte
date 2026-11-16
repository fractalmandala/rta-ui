<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ColorChannel } from './color.js';

	export interface ColorPickerChannelSliderProps
		extends Omit<HTMLProps<'div'>, 'role'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		channel: ColorChannel;
		orientation?: 'horizontal' | 'vertical';
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './ColorPicker.module.css';
	import ColorPickerChannelSliderThumb from './ColorPickerChannelSliderThumb.svelte';
	import ColorPickerChannelSliderTrack from './ColorPickerChannelSliderTrack.svelte';
	import ColorPickerTransparencyGrid from './ColorPickerTransparencyGrid.svelte';
	import {
		setColorPickerChannelContext,
		useColorPickerContext,
		useColorPickerFormatContext
	} from './color-picker.state.svelte';

	let {
		asChild,
		channel,
		children,
		class: className,
		onpointerdown,
		orientation = 'horizontal',
		ref = $bindable(null),
		...props
	}: ColorPickerChannelSliderProps = $props();

	const api = useColorPickerContext();
	const view = useColorPickerFormatContext();
	const sliderStyle = 'position: relative; touch-action: none;';

	setColorPickerChannelContext({
		get channel() {
			return channel;
		},
		get orientation() {
			return orientation;
		},
		get format() {
			return view?.format;
		}
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	role="presentation"
	data-scope="color-picker"
	data-part="channel-slider"
	data-channel={channel}
	data-orientation={orientation}
	style={mergeStyleDeclarations(sliderStyle, props.style)}
	data-slot="color-picker-channel-slider"
	class={cn(styles.channelSlider, className)}
	onpointerdown={(event) => {
		onpointerdown?.(event);
		if (event.defaultPrevented) return;
		api.onChannelSliderPointerDown(event, channel, { orientation, format: view?.format });
	}}
>
	{#if children}
		{@render children()}
	{:else}
		{#if channel === 'alpha'}
			<ColorPickerTransparencyGrid />
		{/if}
		<ColorPickerChannelSliderTrack />
		<ColorPickerChannelSliderThumb />
	{/if}
</Element>
