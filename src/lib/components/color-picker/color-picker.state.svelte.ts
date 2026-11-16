import { createContext } from '../../internal/context';
import { getTabbables, useDismissableLayer, useEscapeLayer, type InteractOutsideEvent } from '../../internal/layers.svelte.js';
import {
	floatingStyle,
	getPlacement,
	getSide,
	type Placement,
	type PositionOptions,
	type Side
} from '../../internal/positioning.svelte.js';
import { createPresence } from '../../internal/presence.svelte.js';
import {
	getChannelDisplayColor,
	getChannelRange,
	getChannelValue,
	getColorAreaGradient,
	getSliderBackground,
	normalizeColor,
	parseColor,
	prefixHex,
	styleString,
	type ColorChannel,
	type ColorChannelRange,
	type ColorFormat,
	type ColorType,
	type ColorStringFormat
} from './color.js';

export type { ColorChannel, ColorChannelRange, ColorFormat, ColorType, ColorStringFormat };
export type ColorPickerColor = ColorType;

export interface ColorPickerValueChangeDetails {
	value: string;
	valueAsString: string;
}

export interface ColorPickerFormatChangeDetails {
	format: ColorFormat;
}

export interface ColorPickerOpenChangeDetails {
	open: boolean;
	value: string;
}

export type ColorPickerFocusOutsideEvent = InteractOutsideEvent;
export type ColorPickerInteractOutsideEvent = InteractOutsideEvent;
export type ColorPickerPointerDownOutsideEvent = InteractOutsideEvent;

export interface ColorPickerElementIds {
	root?: string;
	label?: string;
	hiddenInput?: string;
	control?: string;
	trigger?: string;
	content?: string;
	positioner?: string;
	formatSelect?: string;
	area?: string;
	areaGradient?: string;
	areaThumb?: string;
	channelSliderTrack?: (channel: ColorChannel) => string;
	channelSliderThumb?: (channel: ColorChannel) => string;
}

export type ColorPickerPortalRef = HTMLElement | (() => HTMLElement | null | undefined);

export interface UseColorPickerProps {
	id?: string | null;
	ids?: ColorPickerElementIds;
	value?: string;
	defaultValue?: string;
	format?: ColorFormat;
	defaultFormat?: ColorFormat;
	open?: boolean;
	defaultOpen?: boolean;
	inline?: boolean;
	closeOnSelect?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	invalid?: boolean;
	name?: string;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	positioning?: PositionOptions;
	openAutoFocus?: boolean;
	initialFocusEl?: () => HTMLElement | null | false;
	portalled?: boolean;
	portalRef?: ColorPickerPortalRef;
	lazyMount?: boolean;
	unmountOnExit?: boolean;
	onValueChange?: (details: ColorPickerValueChangeDetails) => void;
	onValueChangeEnd?: (details: ColorPickerValueChangeDetails) => void;
	onFormatChange?: (details: ColorPickerFormatChangeDetails) => void;
	onOpenChange?: (details: ColorPickerOpenChangeDetails) => void;
	onPointerDownOutside?: (event: ColorPickerPointerDownOutsideEvent) => void;
	onFocusOutside?: (event: ColorPickerFocusOutsideEvent) => void;
	onInteractOutside?: (event: ColorPickerInteractOutsideEvent) => void;
}

export interface ColorPickerAreaChannels {
	xChannel: ColorChannel;
	yChannel: ColorChannel;
}

export interface ColorPickerSwatchState {
	value: ColorType;
	valueAsString: string;
	checked: boolean;
	disabled: boolean;
}

export interface ColorPickerApi {
	readonly id: string;
	readonly rootId: string;
	readonly labelId: string;
	readonly controlId: string;
	readonly triggerId: string;
	readonly contentId: string;
	readonly positionerId: string;
	readonly areaId: string;
	readonly areaGradientId: string;
	readonly areaThumbId: string;
	readonly hiddenInputId: string;
	readonly formatSelectId: string;
	readonly open: boolean;
	readonly present: boolean;
	readonly hidden: boolean;
	readonly inline: boolean;
	readonly value: string;
	readonly valueAsString: string;
	readonly cssValue: string;
	formatValue(format?: ColorStringFormat): string;
	readonly format: ColorFormat;
	readonly nextFormat: ColorFormat;
	readonly alpha: number;
	readonly disabled: boolean;
	readonly readOnly: boolean;
	readonly invalid: boolean;
	readonly required: boolean;
	readonly name: string | undefined;
	readonly interactive: boolean;
	readonly focused: boolean;
	readonly dragging: boolean;
	readonly activeId: string | null;
	readonly activeChannel: ColorChannel | ColorPickerAreaChannels | null;
	readonly activeOrientation: 'horizontal' | 'vertical' | null;
	readonly dir: 'ltr' | 'rtl' | 'auto';
	readonly placement: Placement;
	readonly side: Side;
	readonly portalled: boolean;
	readonly portalTarget: Element | null | undefined;
	readonly positionerStyle: string;
	readonly rootStyle: string;
	channelSliderTrackId(channel: ColorChannel): string;
	channelSliderThumbId(channel: ColorChannel): string;
	areaColor(): ColorType;
	areaChannels(overrides?: Partial<ColorPickerAreaChannels>): ColorPickerAreaChannels;
	areaStyle(overrides?: Partial<ColorPickerAreaChannels>): string;
	areaBackgroundStyle(overrides?: Partial<ColorPickerAreaChannels>): string;
	areaThumbStyle(overrides?: Partial<ColorPickerAreaChannels>): string;
	areaThumbXValue(overrides?: Partial<ColorPickerAreaChannels>): number;
	areaThumbYValue(overrides?: Partial<ColorPickerAreaChannels>): number;
	channelRange(channel: string): ColorChannelRange | undefined;
	channelInputValue(channel: string): string;
	channelValueText(channel: ColorChannel, locale?: string): string;
	channelSliderTrackStyle(
		channel: ColorChannel,
		options: { orientation?: 'horizontal' | 'vertical'; format?: ColorFormat }
	): string;
	channelSliderThumbStyle(
		channel: ColorChannel,
		options: { orientation?: 'horizontal' | 'vertical'; format?: ColorFormat }
	): string;
	channelSliderThumbRange(
		channel: ColorChannel,
		options: { format?: ColorFormat }
	): { minValue: number; maxValue: number; value: number };
	swatchState(value: string | ColorType, disabled?: boolean): ColorPickerSwatchState;
	swatchStyle(value: string | ColorType, respectAlpha?: boolean): string;
	swatchTriggerStyle(value: string | ColorType, disabled?: boolean): string;
	transparencyGridStyle(size?: string): string;
	setOpen(open: boolean): void;
	setValue(value: string | ColorType): void;
	setFormat(format: ColorFormat): void;
	setAlpha(alpha: number): void;
	toggleFormat(): void;
	onTriggerClick(): void;
	onLabelClick(event: MouseEvent): void;
	onAreaPointerDown(event: PointerEvent, overrides?: Partial<ColorPickerAreaChannels>): void;
	onAreaThumbFocus(overrides?: Partial<ColorPickerAreaChannels>): void;
	onAreaThumbKeyDown(
		event: KeyboardEvent,
		overrides?: Partial<ColorPickerAreaChannels>
	): void;
	onChannelSliderPointerDown(
		event: PointerEvent,
		channel: ColorChannel,
		options?: { orientation?: 'horizontal' | 'vertical'; format?: ColorFormat }
	): void;
	onChannelSliderThumbFocus(channel: ColorChannel): void;
	onChannelSliderThumbKeyDown(
		event: KeyboardEvent,
		channel: ColorChannel,
		options?: { orientation?: 'horizontal' | 'vertical'; format?: ColorFormat }
	): void;
	onChannelSliderLabelClick(channel: ColorChannel): void;
	onChannelInputBeforeInput(event: Event, channel: string): void;
	onChannelInputFocus(event: Event, channel: string): void;
	onChannelInputBlur(event: Event, channel: string): void;
	onChannelInputKeyDown(event: KeyboardEvent, channel: string): void;
	onSwatchTriggerClick(value: string | ColorType, disabled?: boolean): void;
	onEyeDropperClick(): void;
	onFormatSelectChange(event: Event): void;
	setAreaNode(node: HTMLElement | null): void;
	setAreaThumbNode(node: HTMLElement | null): void;
	setChannelSliderTrackNode(channel: ColorChannel, node: HTMLElement | null): void;
	setChannelSliderThumbNode(channel: ColorChannel, node: HTMLElement | null): void;
	setControlNode(node: HTMLElement | null): void;
	setContentNode(node: HTMLElement | null): void;
	setPositionerNode(node: HTMLElement | null): void;
	setTriggerNode(node: HTMLElement | null): void;
	setHiddenInputNode(node: HTMLInputElement | null): void;
}

const colorPickerContext = createContext<ColorPickerApi>('ColorPicker', 'ColorPicker.Root');
export const useColorPickerContext = () => colorPickerContext.get();
export const setColorPickerContext = (api: ColorPickerApi) => colorPickerContext.set(api);

const areaContext = createContext<Partial<ColorPickerAreaChannels>>('ColorPickerArea', 'ColorPicker.Area');
export const useColorPickerAreaContext = () => areaContext.use();
export const setColorPickerAreaContext = (value: Partial<ColorPickerAreaChannels>) =>
	areaContext.set(value);

export interface ColorPickerChannelContextValue {
	channel: ColorChannel;
	orientation?: 'horizontal' | 'vertical';
	format?: ColorFormat;
}

const channelContext = createContext<ColorPickerChannelContextValue>(
	'ColorPickerChannel',
	'ColorPicker.ChannelSlider'
);
export const useColorPickerChannelContext = () => channelContext.get();
export const setColorPickerChannelContext = (value: ColorPickerChannelContextValue) =>
	channelContext.set(value);

export interface ColorPickerSwatchContextValue {
	value: string | ColorType;
	respectAlpha?: boolean;
}

const swatchContext = createContext<ColorPickerSwatchContextValue>('ColorPickerSwatch', 'ColorPicker.Swatch');
export const useColorPickerSwatchContext = () => swatchContext.use();
export const setColorPickerSwatchContext = (value: ColorPickerSwatchContextValue) =>
	swatchContext.set(value);

export interface ColorPickerFormatContextValue {
	format?: ColorFormat;
}

const formatContext = createContext<ColorPickerFormatContextValue>('ColorPickerFormat', 'ColorPicker.View');
export const useColorPickerFormatContext = () => formatContext.use();
export const setColorPickerFormatContext = (value: ColorPickerFormatContextValue) =>
	formatContext.set(value);

const DEFAULT_COLOR = '#000000';
const FORMATS: ColorFormat[] = ['hsba', 'hsla', 'rgba'];

function getEventPoint(event: PointerEvent | MouseEvent): { x: number; y: number } {
	return { x: event.clientX, y: event.clientY };
}

function getEventKey(event: KeyboardEvent, dir?: string): string {
	const map: Record<string, string> = {
		Up: 'ArrowUp',
		Down: 'ArrowDown',
		Esc: 'Escape',
		' ': 'Space',
		Left: 'ArrowLeft',
		Right: 'ArrowRight'
	};
	let key = map[event.key] ?? event.key;
	if (dir === 'rtl' && (key === 'ArrowLeft' || key === 'ArrowRight')) {
		key = key === 'ArrowLeft' ? 'ArrowRight' : 'ArrowLeft';
	}
	return key;
}

function getEventStep(event: KeyboardEvent): number {
	const arrows = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
	return event.key === 'PageUp' || event.key === 'PageDown' || (event.shiftKey && arrows.includes(event.key))
		? 10
		: 1;
}

function clampPercent(value: number): number {
	return Math.min(Math.max(value, 0), 1);
}

interface RelativePercent {
	x: number;
	y: number;
}

function getRelativePercent(point: { x: number; y: number }, element: HTMLElement): RelativePercent {
	const { left, top, width, height } = element.getBoundingClientRect();
	return {
		x: clampPercent(width === 0 ? 0 : (point.x - left) / width),
		y: clampPercent(height === 0 ? 0 : (point.y - top) / height)
	};
}

type DragState =
	| { kind: 'area'; channels: ColorPickerAreaChannels }
	| {
			kind: 'channel';
			channel: ColorChannel;
			orientation: 'horizontal' | 'vertical';
			format?: ColorFormat;
	  };

export function createColorPicker(getProps: () => UseColorPickerProps, uid: string): ColorPickerApi {
	const id = getProps().id ?? uid;
	const ids = getProps().ids ?? {};

	const initialColor = parseColor(getProps().value ?? getProps().defaultValue ?? DEFAULT_COLOR);

	const rootId = ids.root ?? `color-picker:${id}`;
	const labelId = ids.label ?? `color-picker:${id}:label`;
	const hiddenInputId = ids.hiddenInput ?? `color-picker:${id}:hidden-input`;
	const controlId = ids.control ?? `color-picker:${id}:control`;
	const triggerId = ids.trigger ?? `color-picker:${id}:trigger`;
	const contentId = ids.content ?? `color-picker:${id}:content`;
	const positionerId = ids.positioner ?? `color-picker:${id}:positioner`;
	const formatSelectId = ids.formatSelect ?? `color-picker:${id}:format-select`;
	const areaId = ids.area ?? `color-picker:${id}:area`;
	const areaGradientId = ids.areaGradient ?? `color-picker:${id}:area-gradient`;
	const areaThumbId = ids.areaThumb ?? `color-picker:${id}:area-thumb`;

	let internalValue = $state<ColorType>(initialColor);
	let internalFormat = $state<ColorFormat>(getProps().defaultFormat ?? initialColor.getFormat());
	let internalOpen = $state(Boolean(getProps().defaultOpen));
	let focused = $state(false);
	let dragging = $state(false);
	let activeChannel = $state<ColorChannel | ColorPickerAreaChannels | null>(null);
	let activeOrientation = $state<'horizontal' | 'vertical' | null>(null);
	let activeId = $state<string | null>(null);
	let restoreFocus = $state(true);
	let currentPlacement = $state<Placement>(getProps().positioning?.placement ?? 'bottom');

	let triggerNode = $state<HTMLElement | null>(null);
	let contentNode = $state<HTMLElement | null>(null);
	let positionerNode = $state<HTMLElement | null>(null);
	let controlNode = $state<HTMLElement | null>(null);
	let areaNode = $state<HTMLElement | null>(null);
	let areaThumbNode = $state<HTMLElement | null>(null);
	let hiddenInputNode = $state<HTMLInputElement | null>(null);
	const sliderTrackNodes = new Map<ColorChannel, HTMLElement>();
	const sliderThumbNodes = new Map<ColorChannel, HTMLElement>();

	let externalCache: { text: string; color: ColorType } | null = null;

	function externalColor(): ColorType | null {
		const text = getProps().value;
		if (text === undefined) return null;
		if (!externalCache || externalCache.text !== text) {
			externalCache = { text, color: parseColor(text) };
		}
		return externalCache.color;
	}

	function color(): ColorType {
		return externalColor() ?? internalValue;
	}

	function format(): ColorFormat {
		return getProps().format ?? internalFormat;
	}

	function isOpen(): boolean {
		if (getProps().inline) return true;
		return getProps().open ?? internalOpen;
	}

	function disabled(): boolean {
		return Boolean(getProps().disabled);
	}

	function readOnly(): boolean {
		return Boolean(getProps().readOnly);
	}

	function interactive(): boolean {
		return !disabled() && !readOnly();
	}

	function dir(): 'ltr' | 'rtl' | 'auto' {
		return getProps().dir ?? 'ltr';
	}

	function areaColor(): ColorType {
		const current = format();
		return color().toFormat(current.startsWith('hsl') ? 'hsla' : 'hsba');
	}

	function channelSliderTrackId(channel: ColorChannel): string {
		return ids.channelSliderTrack?.(channel) ?? `color-picker:${id}:slider-track:${channel}`;
	}

	function channelSliderThumbId(channel: ColorChannel): string {
		return ids.channelSliderThumb?.(channel) ?? `color-picker:${id}:slider-thumb:${channel}`;
	}

	function detailsOf(next: ColorType): ColorPickerValueChangeDetails {
		return { value: next.toString(format()), valueAsString: next.toString(format()) };
	}

	function setValue(value: string | ColorType) {
		const next = normalizeColor(value).toFormat(format());
		const current = color();
		if (next.isEqual(current)) return;
		if (getProps().value === undefined) internalValue = next;
		getProps().onValueChange?.(detailsOf(next));
	}

	function setFormat(next: ColorFormat) {
		const current = color();
		if (getProps().format === undefined) internalFormat = next;
		getProps().onFormatChange?.({ format: next });
		// `toFormat` returns the same instance for its own format, which is how Zag guards this sync.
		const converted = current.toFormat(next);
		if (converted === current) return;
		if (getProps().value === undefined) internalValue = converted;
		getProps().onValueChange?.(detailsOf(converted));
	}

	function toggleFormat() {
		const index = FORMATS.indexOf(format());
		setFormat(FORMATS[index + 1] ?? FORMATS[0]);
	}

	function setOpen(open: boolean) {
		if (getProps().inline) return;
		if (open === isOpen()) return;
		if (getProps().open === undefined) internalOpen = open;
		getProps().onOpenChange?.({ open, value: color().toString(format()) });
	}

	function invokeOnChangeEnd(next: ColorType = color()) {
		getProps().onValueChangeEnd?.(detailsOf(next));
	}

	function setActiveChannel(
		nextId: string,
		channel: ColorChannel | ColorPickerAreaChannels,
		orientation?: 'horizontal' | 'vertical'
	) {
		activeId = nextId;
		activeChannel = channel;
		if (orientation) activeOrientation = orientation;
	}

	function clearActiveChannel() {
		activeChannel = null;
		activeId = null;
		activeOrientation = null;
	}

	function focusedAreaChannels(overrides?: Partial<ColorPickerAreaChannels>): ColorPickerAreaChannels {
		const channels = areaColor().getChannels();
		return {
			xChannel: overrides?.xChannel ?? channels[1],
			yChannel: overrides?.yChannel ?? channels[2]
		};
	}

	function gradientFor(overrides?: Partial<ColorPickerAreaChannels>) {
		const { xChannel, yChannel } = focusedAreaChannels(overrides);
		return getColorAreaGradient(areaColor(), { xChannel, yChannel, dir: dir() });
	}

	function areaStyle(overrides?: Partial<ColorPickerAreaChannels>): string {
		const { areaStyles } = gradientFor(overrides);
		return styleString({
			position: 'relative',
			touchAction: 'none',
			forcedColorAdjust: 'none',
			...areaStyles
		});
	}

	function areaBackgroundStyle(overrides?: Partial<ColorPickerAreaChannels>): string {
		const { areaGradientStyles } = gradientFor(overrides);
		return styleString({
			position: 'relative',
			touchAction: 'none',
			forcedColorAdjust: 'none',
			...areaGradientStyles
		});
	}

	function areaThumbGeometry(overrides?: Partial<ColorPickerAreaChannels>) {
		const { xChannel, yChannel } = focusedAreaChannels(overrides);
		const value = areaColor();
		const xPercent = value.getChannelValuePercent(xChannel);
		const yPercent = 1 - value.getChannelValuePercent(yChannel);
		const finalXPercent = dir() === 'rtl' ? 1 - xPercent : xPercent;
		return { xPercent: finalXPercent, yPercent };
	}

	function areaThumbStyle(overrides?: Partial<ColorPickerAreaChannels>): string {
		const { xPercent, yPercent } = areaThumbGeometry(overrides);
		const swatch = areaColor().withChannelValue('alpha', 1).toString('css');
		return styleString({
			position: 'absolute',
			left: `${xPercent * 100}%`,
			top: `${yPercent * 100}%`,
			transform: 'translate(-50%, -50%)',
			touchAction: 'none',
			forcedColorAdjust: 'none',
			'--color': swatch,
			background: swatch
		});
	}

	function areaThumbXValue(overrides?: Partial<ColorPickerAreaChannels>): number {
		const { xChannel } = focusedAreaChannels(overrides);
		return areaColor().getChannelValue(xChannel);
	}

	function areaThumbYValue(overrides?: Partial<ColorPickerAreaChannels>): number {
		const { yChannel } = focusedAreaChannels(overrides);
		return areaColor().getChannelValue(yChannel);
	}

	function channelRange(channel: string): ColorChannelRange | undefined {
		return getChannelRange(color(), channel);
	}

	function channelInputValue(channel: string): string {
		return getChannelValue(color(), channel);
	}

	function channelValueText(channel: ColorChannel, locale = 'en-US'): string {
		const current = color();
		const source =
			channel === 'hue' || channel === 'saturation' || channel === 'lightness'
				? current.toFormat('hsla')
				: channel === 'brightness'
					? current.toFormat('hsba')
					: channel === 'red' || channel === 'green' || channel === 'blue'
						? current.toFormat('rgba')
						: current;
		return source.formatChannelValue(channel, locale);
	}

	function channelSliderTrackStyle(
		channel: ColorChannel,
		options: { orientation?: 'horizontal' | 'vertical'; format?: ColorFormat }
	): string {
		const normalized = options.format ? color().toFormat(options.format) : areaColor();
		return styleString({
			position: 'relative',
			forcedColorAdjust: 'none',
			backgroundImage: getSliderBackground({
				orientation: options.orientation ?? 'horizontal',
				channel,
				dir: dir(),
				value: normalized
			})
		});
	}

	function channelSliderThumbData(
		channel: ColorChannel,
		options: { orientation?: 'horizontal' | 'vertical'; format?: ColorFormat }
	) {
		const orientation = options.orientation ?? 'horizontal';
		const normalized = options.format ? color().toFormat(options.format) : areaColor();
		const range = normalized.getChannelRange(channel);
		const value = normalized.getChannelValue(channel);
		const offset = (value - range.minValue) / (range.maxValue - range.minValue);
		const finalOffset = orientation === 'horizontal' && dir() === 'rtl' ? 1 - offset : offset;
		return { orientation, range, value, offset: finalOffset };
	}

	function channelSliderThumbStyle(
		channel: ColorChannel,
		options: { orientation?: 'horizontal' | 'vertical'; format?: ColorFormat }
	): string {
		const { orientation, offset } = channelSliderThumbData(channel, options);
		const display = getChannelDisplayColor(areaColor(), channel).toString('css');
		return styleString({
			forcedColorAdjust: 'none',
			position: 'absolute',
			background: display,
			...(orientation === 'horizontal'
				? { left: `${offset * 100}%`, top: '50%' }
				: { top: `${offset * 100}%`, left: '50%' })
		});
	}

	function channelSliderThumbRange(
		channel: ColorChannel,
		options: { format?: ColorFormat }
	): { minValue: number; maxValue: number; value: number } {
		const { range, value } = channelSliderThumbData(channel, options);
		return { minValue: range.minValue, maxValue: range.maxValue, value };
	}

	function swatchState(value: string | ColorType, disabledProp?: boolean): ColorPickerSwatchState {
		const swatch = normalizeColor(value).toFormat(format());
		return {
			value: swatch,
			valueAsString: swatch.toString('hex'),
			checked: swatch.isEqual(color()),
			disabled: Boolean(disabledProp) || !interactive()
		};
	}

	function swatchStyle(value: string | ColorType, respectAlpha = true): string {
		const swatch = normalizeColor(value).toFormat(format());
		const css = swatch.toString(respectAlpha ? 'css' : 'hex');
		return styleString({ '--color': css, position: 'relative', background: css });
	}

	function swatchTriggerStyle(value: string | ColorType, disabledProp?: boolean): string {
		const { valueAsString } = swatchState(value, disabledProp);
		return styleString({ '--color': valueAsString, position: 'relative' });
	}

	function transparencyGridStyle(size = '12px'): string {
		return styleString({
			'--size': size,
			width: '100%',
			height: '100%',
			position: 'absolute',
			backgroundColor: '#fff',
			backgroundImage:
				'conic-gradient(#eeeeee 0 25%, transparent 0 50%, #eeeeee 0 75%, transparent 0)',
			backgroundSize: 'var(--size) var(--size)',
			inset: '0px',
			zIndex: 'auto',
			pointerEvents: 'none'
		});
	}

	function setAreaColorFromPoint(percent: RelativePercent, channels: ColorPickerAreaChannels) {
		const value = areaColor();
		const { xChannel, yChannel } = channels;
		const xValue = value.getChannelPercentValue(xChannel, percent.x);
		const yValue = value.getChannelPercentValue(yChannel, 1 - percent.y);
		setValue(value.withChannelValue(xChannel, xValue).withChannelValue(yChannel, yValue));
	}

	function setChannelColorFromPoint(
		percent: RelativePercent,
		channel: ColorChannel,
		formatOverride: ColorFormat | undefined,
		orientation: 'horizontal' | 'vertical'
	) {
		const normalized = formatOverride ? color().toFormat(formatOverride) : areaColor();
		const channelPercent = orientation === 'horizontal' ? percent.x : percent.y;
		const value = normalized.getChannelPercentValue(channel, channelPercent);
		setValue(normalized.withChannelValue(channel, value));
	}

	let dragState: DragState | null = null;
	let dragCleanup: (() => void) | null = null;

	function endDrag(invokeEnd: boolean) {
		if (!dragCleanup) return;
		const cleanup = dragCleanup;
		dragCleanup = null;
		cleanup();
		dragging = false;
		dragState = null;
		clearActiveChannel();
		if (invokeEnd) invokeOnChangeEnd();
	}

	function startDrag(next: DragState) {
		if (dragCleanup) return;
		const doc = contentNode?.ownerDocument ?? document;
		dragState = next;
		dragging = true;

		const onPointerMove = (event: PointerEvent) => {
			const current = dragState;
			if (!current) return;
			const element =
				current.kind === 'area' ? areaNode : sliderTrackNodes.get(current.channel) ?? null;
			if (!element) return;
			const percent = getRelativePercent(getEventPoint(event), element);
			if (current.kind === 'area') setAreaColorFromPoint(percent, current.channels);
			else setChannelColorFromPoint(percent, current.channel, current.format, current.orientation);
			focusActiveThumb();
		};

		const onPointerUp = () => endDrag(true);

		doc.addEventListener('pointermove', onPointerMove);
		doc.addEventListener('pointerup', onPointerUp);
		doc.addEventListener('pointercancel', onPointerUp);

		dragCleanup = () => {
			doc.removeEventListener('pointermove', onPointerMove);
			doc.removeEventListener('pointerup', onPointerUp);
			doc.removeEventListener('pointercancel', onPointerUp);
		};
	}

	function focusActiveThumb() {
		const current = dragState;
		const element =
			current?.kind === 'area'
				? areaThumbNode
				: current?.kind === 'channel'
					? sliderThumbNodes.get(current.channel) ?? null
					: null;
		if (!element) return;
		requestAnimationFrame(() => {
			element.focus({ preventScroll: true });
		});
	}

	function onAreaPointerDown(event: PointerEvent, overrides?: Partial<ColorPickerAreaChannels>) {
		if (!interactive()) return;
		if (event.button !== 0) return;
		if (event.ctrlKey || event.altKey || event.metaKey) return;
		const channels = focusedAreaChannels(overrides);
		event.preventDefault();
		setActiveChannel('area', channels, 'horizontal');
		const element = areaNode;
		if (element) {
			setAreaColorFromPoint(getRelativePercent(getEventPoint(event), element), channels);
		}
		startDrag({ kind: 'area', channels });
		focusActiveThumb();
	}

	function onAreaThumbKeyDown(event: KeyboardEvent, overrides?: Partial<ColorPickerAreaChannels>) {
		if (event.defaultPrevented) return;
		if (!interactive()) return;
		const { xChannel, yChannel } = focusedAreaChannels(overrides);
		const step = getEventStep(event);
		const value = areaColor();
		const run = (next: ColorType) => {
			event.preventDefault();
			setValue(next);
		};
		switch (getEventKey(event, dir())) {
			case 'ArrowUp':
				return run(value.incrementChannel(yChannel, step));
			case 'ArrowDown':
				return run(value.decrementChannel(yChannel, step));
			case 'ArrowLeft':
				return run(value.decrementChannel(xChannel, step));
			case 'ArrowRight':
				return run(value.incrementChannel(xChannel, step));
			case 'PageUp':
				return run(value.incrementChannel(xChannel, step));
			case 'PageDown':
				return run(value.decrementChannel(xChannel, step));
			case 'Escape':
				event.stopPropagation();
				return;
		}
	}

	function onChannelSliderPointerDown(
		event: PointerEvent,
		channel: ColorChannel,
		options: { orientation?: 'horizontal' | 'vertical'; format?: ColorFormat } = {}
	) {
		if (!interactive()) return;
		if (event.button !== 0) return;
		if (event.ctrlKey || event.altKey || event.metaKey) return;
		const orientation = options.orientation ?? 'horizontal';
		event.preventDefault();
		setActiveChannel(channel, channel, orientation);
		const element = sliderTrackNodes.get(channel);
		if (element) {
			setChannelColorFromPoint(getRelativePercent(getEventPoint(event), element), channel, options.format, orientation);
		}
		startDrag({ kind: 'channel', channel, orientation, format: options.format });
		focusActiveThumb();
	}

	function onChannelSliderThumbKeyDown(
		event: KeyboardEvent,
		channel: ColorChannel,
		options: { orientation?: 'horizontal' | 'vertical'; format?: ColorFormat } = {}
	) {
		if (event.defaultPrevented) return;
		if (!interactive()) return;
		const normalized = options.format ? color().toFormat(options.format) : areaColor();
		const range = normalized.getChannelRange(channel);
		const step = getEventStep(event) * range.step;
		const run = (next: ColorType) => {
			event.preventDefault();
			setValue(next);
		};
		switch (getEventKey(event, dir())) {
			case 'ArrowUp':
			case 'ArrowRight':
				return run(normalized.incrementChannel(channel, step));
			case 'ArrowDown':
			case 'ArrowLeft':
				return run(normalized.decrementChannel(channel, step));
			case 'PageUp':
				return run(normalized.incrementChannel(channel, range.pageSize));
			case 'PageDown':
				return run(normalized.decrementChannel(channel, range.pageSize));
			case 'Home':
				return run(normalized.withChannelValue(channel, range.minValue));
			case 'End':
				return run(normalized.withChannelValue(channel, range.maxValue));
			case 'Escape':
				event.stopPropagation();
				return;
		}
	}

	function onChannelInputFocus(event: Event, channel: string) {
		if (!interactive()) return;
		focused = true;
		setActiveChannel(channel, channel as ColorChannel);
		const target = event.currentTarget as HTMLInputElement | null;
		target?.select();
	}

	function onChannelInputBlur(event: Event, channel: string) {
		focused = false;
		if (!interactive()) return;
		const target = event.currentTarget as HTMLInputElement | null;
		if (!target) return;
		setChannelColorFromInput(channel, target.value);
	}

	function onChannelInputKeyDown(event: KeyboardEvent, channel: string) {
		if (event.defaultPrevented) return;
		if (!interactive()) return;
		if (event.isComposing) return;
		if (event.key !== 'Enter') return;
		const target = event.currentTarget as HTMLInputElement | null;
		if (!target) return;
		event.preventDefault();
		setChannelColorFromInput(channel, target.value);
	}

	function onChannelInputBeforeInput(event: Event, channel: string) {
		const isTextField = channel === 'hex' || channel === 'css';
		if (isTextField || !interactive()) return;
		const target = event.currentTarget as HTMLInputElement | null;
		if (target && /[^0-9.]/g.test(target.value)) event.preventDefault();
	}

	function setChannelColorFromInput(channel: string, rawValue: string) {
		const isTextField = channel === 'hex' || channel === 'css';
		const current = color();
		const currentAlpha = current.getChannelValue('alpha');
		let next: ColorType;
		if (channel === 'alpha') {
			const parsed = parseFloat(rawValue);
			next = current.withChannelValue('alpha', Number.isNaN(parsed) ? currentAlpha : parsed);
		} else if (isTextField) {
			let parsed: ColorType;
			try {
				parsed = parseColor(channel === 'hex' ? prefixHex(rawValue) : rawValue);
			} catch {
				parsed = current;
			}
			next = parsed.withChannelValue('alpha', currentAlpha);
		} else {
			const number = Number(rawValue);
			const inFormat = current.toFormat(format());
			next = inFormat.withChannelValue(
				channel as ColorChannel,
				Number.isNaN(number) ? inFormat.getChannelValue(channel as ColorChannel) : number
			);
		}
		setValue(next);
		invokeOnChangeEnd(next);
	}

	function onSwatchTriggerClick(value: string | ColorType, disabledProp?: boolean) {
		const state = swatchState(value, disabledProp);
		if (state.disabled) return;
		setValue(state.value);
		if (!getProps().closeOnSelect) return;
		setOpen(false);
	}

	function onEyeDropperClick() {
		if (!interactive()) return;
		const win = window as Window & {
			EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
		};
		if (!win.EyeDropper) return;
		new win.EyeDropper()
			.open()
			.then(({ sRGBHex }) => {
				const next = parseColor(sRGBHex).toFormat(color().getFormat());
				setValue(next);
				invokeOnChangeEnd(next);
			})
			.catch(() => undefined);
	}

	function onFormatSelectChange(event: Event) {
		const target = event.currentTarget as HTMLSelectElement | null;
		if (!target) return;
		if (!FORMATS.includes(target.value as ColorFormat)) return;
		setFormat(target.value as ColorFormat);
	}

	function onLabelClick(event: MouseEvent) {
		event.preventDefault();
		const input = controlNode?.querySelector<HTMLInputElement>('[data-channel="hex"]');
		input?.focus({ preventScroll: true });
	}

	const presence = createPresence({
		present: () => isOpen(),
		getNode: () => contentNode,
		lazyMount: () => getProps().lazyMount ?? true,
		unmountOnExit: () => getProps().unmountOnExit ?? true
	});

	$effect(() => {
		if (!isOpen() || getProps().inline) return;
		const floating = positionerNode;
		const anchor = triggerNode;
		if (!floating || !anchor) return;
		return getPlacement(anchor, floating, {
			...getProps().positioning,
			onComplete(result) {
				currentPlacement = result.placement;
			}
		});
	});

	useEscapeLayer({
		enabled: () => isOpen() && !getProps().inline,
		onEscape() {
			restoreFocus = true;
			setOpen(false);
		}
	});

	useDismissableLayer({
		enabled: () => isOpen() && !getProps().inline,
		getNode: () => contentNode,
		getExclude: () => [triggerNode],
		onPointerDownOutside: (event) => getProps().onPointerDownOutside?.(event),
		onFocusOutside: (event) => getProps().onFocusOutside?.(event),
		onInteractOutside(event) {
			getProps().onInteractOutside?.(event);
			if (event.defaultPrevented) return;
			const original = event.detail?.originalEvent;
			restoreFocus = !(original?.type === 'focusin' || original?.type === 'contextmenu');
			setOpen(false);
		}
	});

	$effect(() => {
		if (!isOpen() || getProps().inline) return;
		if (getProps().openAutoFocus === false) return;
		const content = contentNode;
		if (!content) return;
		const frame = requestAnimationFrame(() => {
			const custom = getProps().initialFocusEl?.();
			if (custom === false) return;
			const element = custom ?? getTabbables(content)[0] ?? content;
			if (element?.isConnected) element.focus({ preventScroll: true });
		});
		return () => cancelAnimationFrame(frame);
	});

	let lastOpen = isOpen();
	$effect(() => {
		const open = isOpen();
		if (open === lastOpen) return;
		lastOpen = open;
		if (open) return;
		const shouldRestore = restoreFocus;
		restoreFocus = true;
		if (!shouldRestore) return;
		const content = contentNode;
		const active = content?.ownerDocument.activeElement;
		if (active && content && content.contains(active)) {
			requestAnimationFrame(() => {
				if (triggerNode?.isConnected) triggerNode.focus({ preventScroll: true });
			});
		}
	});

	$effect(() => {
		const node = hiddenInputNode;
		const text = color().toString(format());
		if (!node || node.value === text) return;
		node.value = text;
		node.dispatchEvent(new Event('input', { bubbles: true }));
		node.dispatchEvent(new Event('change', { bubbles: true }));
	});

	$effect(() => {
		const node = hiddenInputNode;
		const form = node?.closest('form');
		if (!form) return;
		const onReset = () => setValue(initialColor);
		form.addEventListener('reset', onReset);
		return () => form.removeEventListener('reset', onReset);
	});

	return {
		id,
		rootId,
		labelId,
		controlId,
		triggerId,
		contentId,
		positionerId,
		areaId,
		areaGradientId,
		areaThumbId,
		hiddenInputId,
		formatSelectId,
		get open() {
			return isOpen();
		},
		get present() {
			return presence.present;
		},
		get hidden() {
			return !presence.present || (!isOpen() && !presence.unmountOnExit);
		},
		get inline() {
			return Boolean(getProps().inline);
		},
		get value() {
			return color().toString(format());
		},
		get valueAsString() {
			return color().toString(format());
		},
		get cssValue() {
			return color().toString('css');
		},
		formatValue(stringFormat?: ColorStringFormat) {
			return stringFormat ? color().toString(stringFormat) : color().toString(format());
		},
		get format() {
			return format();
		},
		get nextFormat() {
			const index = FORMATS.indexOf(format());
			return FORMATS[index + 1] ?? FORMATS[0];
		},
		get alpha() {
			return color().getChannelValue('alpha');
		},
		get disabled() {
			return disabled();
		},
		get readOnly() {
			return readOnly();
		},
		get invalid() {
			return Boolean(getProps().invalid);
		},
		get required() {
			return Boolean(getProps().required);
		},
		get name() {
			return getProps().name;
		},
		get interactive() {
			return interactive();
		},
		get focused() {
			return focused;
		},
		get dragging() {
			return dragging;
		},
		get activeId() {
			return activeId;
		},
		get activeChannel() {
			return activeChannel;
		},
		get activeOrientation() {
			return activeOrientation;
		},
		get dir() {
			return dir();
		},
		get placement() {
			return currentPlacement;
		},
		get side() {
			return getSide(currentPlacement);
		},
		get portalled() {
			return getProps().portalled !== false;
		},
		get portalTarget() {
			const ref = getProps().portalRef;
			return (typeof ref === 'function' ? ref() : ref) ?? undefined;
		},
		get positionerStyle() {
			const positioning = getProps().positioning;
			return floatingStyle({
				placement: currentPlacement,
				strategy: positioning?.strategy,
				sameWidth: positioning?.sameWidth,
				fitViewport: positioning?.fitViewport,
				applyStyles: positioning?.applyStyles
			});
		},
		get rootStyle() {
			return styleString({ '--value': color().toString('css') });
		},
		channelSliderTrackId,
		channelSliderThumbId,
		areaColor,
		areaChannels: focusedAreaChannels,
		areaStyle,
		areaBackgroundStyle,
		areaThumbStyle,
		areaThumbXValue,
		areaThumbYValue,
		channelRange,
		channelInputValue,
		channelValueText,
		channelSliderTrackStyle,
		channelSliderThumbStyle,
		channelSliderThumbRange,
		swatchState,
		swatchStyle,
		swatchTriggerStyle,
		transparencyGridStyle,
		setOpen,
		setValue,
		setFormat,
		setAlpha(alpha: number) {
			setValue(color().withChannelValue('alpha', alpha));
		},
		toggleFormat,
		onTriggerClick() {
			if (!interactive()) return;
			setOpen(!isOpen());
		},
		onLabelClick,
		onAreaPointerDown,
		onAreaThumbFocus(overrides) {
			if (!interactive()) return;
			setActiveChannel('area', focusedAreaChannels(overrides));
		},
		onAreaThumbKeyDown,
		onChannelSliderPointerDown,
		onChannelSliderThumbFocus(channel) {
			if (!interactive()) return;
			setActiveChannel(channel, channel);
		},
		onChannelSliderThumbKeyDown,
		onChannelSliderLabelClick(channel) {
			if (!interactive()) return;
			sliderThumbNodes.get(channel)?.focus({ preventScroll: true });
		},
		onChannelInputBeforeInput,
		onChannelInputFocus,
		onChannelInputBlur,
		onChannelInputKeyDown,
		onSwatchTriggerClick,
		onEyeDropperClick,
		onFormatSelectChange,
		setAreaNode(node) {
			areaNode = node;
		},
		setAreaThumbNode(node) {
			areaThumbNode = node;
		},
		setChannelSliderTrackNode(channel, node) {
			if (node) sliderTrackNodes.set(channel, node);
			else sliderTrackNodes.delete(channel);
		},
		setChannelSliderThumbNode(channel, node) {
			if (node) sliderThumbNodes.set(channel, node);
			else sliderThumbNodes.delete(channel);
		},
		setControlNode(node) {
			controlNode = node;
		},
		setContentNode(node) {
			contentNode = node;
		},
		setPositionerNode(node) {
			positionerNode = node;
		},
		setTriggerNode(node) {
			triggerNode = node;
		},
		setHiddenInputNode(node) {
			hiddenInputNode = node;
		}
	};
}

