<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ColorPickerChannelSliderLabelProps
		extends HTMLProps<'label'>, PolymorphicProps<'label'>, RefAttribute {}
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
		onclick,
		ref = $bindable(null),
		...props
	}: ColorPickerChannelSliderLabelProps = $props();

	const api = useColorPickerContext();
	const channel = useColorPickerChannelContext();
	const labelStyle = 'user-select: none; -webkit-user-select: none;';
</script>

<Element
	as="label"
	{...props}
	bind:ref
	{asChild}
	data-scope="color-picker"
	data-part="channel-slider-label"
	data-channel={channel.channel}
	style={mergeStyleDeclarations(labelStyle, props.style)}
	data-slot="color-picker-channel-slider-label"
	class={cn(styles.channelSliderLabel, className)}
	onclick={(event) => {
		onclick?.(event);
		if (event.defaultPrevented) return;
		event.preventDefault();
		api.onChannelSliderLabelClick(channel.channel);
	}}
>
	{@render children?.()}
</Element>
