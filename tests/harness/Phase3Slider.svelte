<script lang="ts">
	import {
		Slider,
		SliderControl,
		SliderDraggingIndicator,
		SliderHiddenInput,
		SliderLabel,
		SliderMarker,
		SliderMarkerGroup,
		SliderRange,
		SliderThumb,
		SliderThumbs,
		SliderTrack,
		SliderValueText,
		type SliderFocusChangeDetails,
		type SliderOrientation,
		type SliderOrigin,
		type SliderThumbCollisionBehavior,
		type SliderThumbSize,
		type SliderValueChangeDetails,
		type SliderValueChangeEndDetails
	} from '../../src/lib/components/slider/index';

	let {
		value = $bindable(undefined),
		defaultValue = [50],
		min = undefined,
		max = undefined,
		step = undefined,
		largeStep = undefined,
		orientation = 'horizontal' as SliderOrientation,
		origin = 'start' as SliderOrigin,
		dir = undefined,
		disabled = false,
		readOnly = false,
		invalid = false,
		name = 'volume',
		thumbs = 1,
		collision = 'none' as SliderThumbCollisionBehavior,
		thumbSize = undefined,
		markers = false,
		draggingIndicator = false,
		hiddenInput = false,
		getAriaValueText = undefined,
		onValueChange,
		onValueChangeEnd,
		onFocusChange
	}: {
		value?: number[];
		defaultValue?: number[];
		min?: number;
		max?: number;
		step?: number;
		largeStep?: number;
		orientation?: SliderOrientation;
		origin?: SliderOrigin;
		dir?: 'ltr' | 'rtl' | 'auto' | null;
		disabled?: boolean;
		readOnly?: boolean;
		invalid?: boolean;
		name?: string;
		thumbs?: number;
		collision?: SliderThumbCollisionBehavior;
		thumbSize?: SliderThumbSize;
		markers?: boolean;
		draggingIndicator?: boolean;
		hiddenInput?: boolean;
		getAriaValueText?: (details: { value: number; index: number }) => string;
		onValueChange?: (details: SliderValueChangeDetails) => void;
		onValueChangeEnd?: (details: SliderValueChangeEndDetails) => void;
		onFocusChange?: (details: SliderFocusChangeDetails) => void;
	} = $props();
</script>

<Slider
	bind:value
	{defaultValue}
	{min}
	{max}
	{step}
	{largeStep}
	{orientation}
	{origin}
	{dir}
	{disabled}
	{readOnly}
	{invalid}
	{name}
	{thumbSize}
	thumbCollisionBehavior={collision}
	{getAriaValueText}
	{onValueChange}
	{onValueChangeEnd}
	{onFocusChange}
>
	<SliderLabel>Volume</SliderLabel>
	<SliderValueText />
	<SliderControl>
		<SliderTrack>
			<SliderRange />
		</SliderTrack>
		{#if thumbs > 1}
			<SliderThumbs />
		{:else}
			<SliderThumb index={0}>
				{#if hiddenInput}
					<SliderHiddenInput />
				{/if}
			</SliderThumb>
		{/if}
		{#if draggingIndicator}
			<SliderDraggingIndicator />
		{/if}
	</SliderControl>
	{#if markers}
		<SliderMarkerGroup>
			<SliderMarker value={0} />
			<SliderMarker value={50} />
			<SliderMarker value={100} />
		</SliderMarkerGroup>
	{/if}
</Slider>
