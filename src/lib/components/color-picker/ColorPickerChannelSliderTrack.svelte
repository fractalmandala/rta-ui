<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ColorPickerChannelSliderTrackProps
		extends Omit<HTMLProps<'div'>, 'role'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './ColorPicker.module.css';
	import { useColorPickerChannelContext, useColorPickerContext } from './color-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: ColorPickerChannelSliderTrackProps = $props();

	const api = useColorPickerContext();
	const channel = useColorPickerChannelContext();
	const trackStyle = $derived(
		api.channelSliderTrackStyle(channel.channel, {
			orientation: channel.orientation,
			format: channel.format
		})
	);

	$effect(() => {
		api.setChannelSliderTrackNode(channel.channel, ref as HTMLElement | null);
		return () => api.setChannelSliderTrackNode(channel.channel, null);
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	id={api.channelSliderTrackId(channel.channel)}
	role="group"
	data-scope="color-picker"
	data-part="channel-slider-track"
	data-channel={channel.channel}
	data-orientation={channel.orientation}
	style={mergeStyleDeclarations(trackStyle, props.style)}
	data-slot="color-picker-channel-slider-track"
	class={cn(styles.channelSliderTrack, className)}
>
	{@render children?.()}
</Element>
