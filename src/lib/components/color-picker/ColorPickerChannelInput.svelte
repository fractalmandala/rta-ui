<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ColorChannel } from './color.js';

	/** Zag's channel inputs also accept the `hex` and `css` text channels. */
	export type ColorPickerChannelInputChannel = ColorChannel | 'hex' | 'css';

	export interface ColorPickerChannelInputProps
		extends Omit<HTMLProps<'input'>, 'type' | 'value'>,
			PolymorphicProps<'input'>,
			RefAttribute {
		channel: ColorPickerChannelInputChannel;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { styleString } from './color.js';
	import styles from './ColorPicker.module.css';
	import { useColorPickerContext } from './color-picker.state.svelte';

	let {
		asChild,
		channel,
		class: className,
		onbeforeinput,
		onblur,
		onfocus,
		onkeydown,
		ref = $bindable(null),
		...props
	}: ColorPickerChannelInputProps = $props();

	const api = useColorPickerContext();
	const isTextField = $derived(channel === 'hex' || channel === 'css');
	const range = $derived(api.channelRange(channel));
	const inputValue = $derived(api.channelInputValue(channel));
	const inputStyle = styleString({
		appearance: 'none',
		WebkitAppearance: 'none',
		MozAppearance: 'textfield'
	});
</script>

<Element
	as="input"
	{...props}
	bind:ref
	{asChild}
	dir={api.dir}
	type={isTextField ? 'text' : 'number'}
	value={inputValue}
	min={range?.minValue}
	max={range?.maxValue}
	step={range?.step}
	disabled={api.disabled}
	readonly={api.readOnly}
	spellcheck={false}
	autocomplete="off"
	aria-label={channel}
	data-scope="color-picker"
	data-part="channel-input"
	data-channel={channel}
	data-disabled={dataAttr(api.disabled)}
	data-invalid={dataAttr(api.invalid)}
	data-readonly={dataAttr(api.readOnly)}
	style={mergeStyleDeclarations(inputStyle, props.style)}
	data-slot="color-picker-channel-input"
	class={cn(styles.channelInput, className)}
	onbeforeinput={(event) => {
		onbeforeinput?.(event);
		if (event.defaultPrevented) return;
		api.onChannelInputBeforeInput(event, channel);
	}}
	onfocus={(event) => {
		onfocus?.(event);
		if (event.defaultPrevented) return;
		api.onChannelInputFocus(event, channel);
	}}
	onblur={(event) => {
		onblur?.(event);
		if (event.defaultPrevented) return;
		api.onChannelInputBlur(event, channel);
	}}
	onkeydown={(event) => {
		onkeydown?.(event);
		if (event.defaultPrevented) return;
		api.onChannelInputKeyDown(event, channel);
	}}
/>
