<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface ColorPickerChannelSliderValueTextProps
		extends HTMLProps<'span'>, PolymorphicProps<'span'>, RefAttribute {
		/** BCP 47 locale used to format the channel value. */
		locale?: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './ColorPicker.module.css';
	import { useColorPickerChannelContext, useColorPickerContext } from './color-picker.state.svelte';

	let {
		asChild,
		children,
		class: className,
		locale,
		ref = $bindable(null),
		...props
	}: ColorPickerChannelSliderValueTextProps = $props();

	const api = useColorPickerContext();
	const channel = useColorPickerChannelContext();
	const text = $derived(api.channelValueText(channel.channel, locale));
</script>

<Element
	as="span"
	{...props}
	bind:ref
	{asChild}
	data-scope="color-picker"
	data-part="channel-slider-value-text"
	data-channel={channel.channel}
	data-slot="color-picker-channel-slider-value-text"
	class={cn(styles.channelSliderValueText, className)}
>
	{#if children}
		{@render children()}
	{:else}
		{text}
	{/if}
</Element>
