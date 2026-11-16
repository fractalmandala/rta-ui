// Colour model ported family-locally from `@zag-js/color-utils` 1.48 (MIT). The maths, channel
// ranges, and gradient strings are copied verbatim so the picker's output matches Zag's exactly;
// nothing here is meant for reuse outside this family.

export type ColorChannel =
	| 'hue'
	| 'saturation'
	| 'brightness'
	| 'lightness'
	| 'red'
	| 'green'
	| 'blue'
	| 'alpha';

export type ColorFormat = 'rgba' | 'hsla' | 'hsba';
export type ColorStringFormat = ColorFormat | 'rgb' | 'hsl' | 'hsb' | 'hex' | 'hexa' | 'css';

export interface Color2DAxes {
	xChannel: ColorChannel;
	yChannel: ColorChannel;
}

export interface ColorAxes extends Color2DAxes {
	zChannel: ColorChannel;
}

export interface ColorChannelRange {
	minValue: number;
	maxValue: number;
	step: number;
	pageSize: number;
}

export interface ColorType {
	toFormat(format: ColorFormat): ColorType;
	toJSON(): Record<string, number>;
	toString(format?: ColorStringFormat): string;
	toHexInt(): number;
	getChannelValue(channel: ColorChannel): number;
	withChannelValue(channel: ColorChannel, value: number): ColorType;
	formatChannelValue(channel: ColorChannel, locale: string): string;
	getChannelRange(channel: ColorChannel): ColorChannelRange;
	getFormat(): ColorFormat;
	getColorAxes(xyChannels: Color2DAxes): ColorAxes;
	getChannels(): [ColorChannel, ColorChannel, ColorChannel];
	clone(): ColorType;
	isEqual(color: ColorType): boolean;
	incrementChannel(channel: ColorChannel, stepSize: number): ColorType;
	decrementChannel(channel: ColorChannel, stepSize: number): ColorType;
	getChannelValuePercent(channel: ColorChannel, value?: number): number;
	getChannelPercentValue(channel: ColorChannel, percent: number): number;
}

export type StyleMap = Record<string, string>;

const { floor, abs, round, min, max, pow, sign } = Math;

const nan = (value: number) => (Number.isNaN(value) ? 0 : value);
export const mod = (value: number, modulus: number) => ((value % modulus) + modulus) % modulus;
const roundValue = (value: number, minValue: number, step: number) =>
	round((nan(value) - minValue) / step) * step + minValue;
const clampValue = (value: number, minValue: number, maxValue: number) =>
	min(max(nan(value), minValue), maxValue);

export const toFixedNumber = (value: number, digits = 0, base = 10) => {
	const power = pow(base, digits);
	return round(value * power) / power;
};

const countDecimals = (value: number) => {
	if (!Number.isFinite(value)) return 0;
	let e = 1;
	let p = 0;
	while (round(value * e) / e !== value) {
		e *= 10;
		p += 1;
	}
	return p;
};

const roundToStepPrecision = (value: number, step: number) => {
	const text = step.toString();
	const pointIndex = text.indexOf('.');
	const precision = pointIndex >= 0 ? text.length - pointIndex : 0;
	if (precision <= 0) return value;
	const power = pow(10, precision);
	return round(value * power) / power;
};

export const snapValueToStep = (
	value: number,
	minValue: number | undefined,
	maxValue: number,
	step: number
) => {
	const min = minValue != null ? Number(minValue) : 0;
	const max = Number(maxValue);
	const remainder = (value - min) % step;
	let snapped =
		abs(remainder) * 2 >= step
			? value + sign(remainder) * (step - abs(remainder))
			: value - remainder;
	snapped = roundToStepPrecision(snapped, step);
	if (!Number.isNaN(min) && snapped < min) snapped = min;
	else if (!Number.isNaN(max) && snapped > max) {
		const scale = pow(10, Math.max(countDecimals(min), countDecimals(max), countDecimals(step)));
		const stepsInRange = floor((round(max * scale) - round(min * scale)) / round(step * scale));
		const largestValidStep = min + stepsInRange * step;
		snapped = stepsInRange <= 0 || largestValidStep < min ? max : largestValidStep;
	}
	return roundToStepPrecision(snapped, step);
};

const getValuePercent = (value: number, minValue: number, maxValue: number) =>
	(nan(value) - minValue) / (maxValue - minValue);

const getPercentValue = (percent: number, minValue: number, maxValue: number, step: number) =>
	clampValue(roundValue(percent * (maxValue - minValue) + minValue, minValue, step), minValue, maxValue);

const isEqualObject = (a: Record<string, number>, b: Record<string, number>) => {
	if (Object.keys(a).length !== Object.keys(b).length) return false;
	for (const key in a) if (a[key] !== b[key]) return false;
	return true;
};

export const camelToKebab = (name: string) =>
	name.startsWith('--') ? name : name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

export function styleString(styles: StyleMap): string {
	const declarations = Object.entries(styles).filter(([, value]) => value != null);
	if (!declarations.length) return '';
	return `${declarations.map(([name, value]) => `${camelToKebab(name)}: ${value}`).join('; ')};`;
}

export abstract class Color implements ColorType {
	abstract toFormat(format: ColorFormat): ColorType;
	abstract toJSON(): Record<string, number>;
	abstract toString(format?: ColorStringFormat): string;
	abstract getChannelValue(channel: ColorChannel): number;
	abstract getChannelRange(channel: ColorChannel): ColorChannelRange;
	abstract getFormat(): ColorFormat;
	abstract getChannels(): [ColorChannel, ColorChannel, ColorChannel];
	abstract clone(): Color;
	abstract getChannelFormatOptions(channel: ColorChannel): Intl.NumberFormatOptions;

	/** Internal: writes one channel on an already cloned instance. */
	protected abstract setChannelValue(channel: ColorChannel, value: number): void;

	toHexInt(): number {
		return this.toFormat('rgba').toHexInt();
	}

	getChannelValuePercent(channel: ColorChannel, valueToCheck?: number): number {
		const value = valueToCheck ?? this.getChannelValue(channel);
		const { minValue, maxValue } = this.getChannelRange(channel);
		return getValuePercent(value, minValue, maxValue);
	}

	getChannelPercentValue(channel: ColorChannel, percentToCheck: number): number {
		const { minValue, maxValue, step } = this.getChannelRange(channel);
		const percentValue = getPercentValue(percentToCheck, minValue, maxValue, step);
		return snapValueToStep(percentValue, minValue, maxValue, step);
	}

	withChannelValue(channel: ColorChannel, value: number): ColorType {
		const { minValue, maxValue } = this.getChannelRange(channel);
		const clone = this.clone();
		clone.setChannelValue(channel, clampValue(value, minValue, maxValue));
		return clone;
	}

	getColorAxes(xyChannels: Color2DAxes): ColorAxes {
		const xChannel = xyChannels.xChannel || this.getChannels().find((c) => c !== xyChannels.yChannel);
		const yChannel = xyChannels.yChannel || this.getChannels().find((c) => c !== xChannel);
		const zChannel = this.getChannels().find((c) => c !== xChannel && c !== yChannel);
		return { xChannel: xChannel as ColorChannel, yChannel: yChannel as ColorChannel, zChannel: zChannel as ColorChannel };
	}

	incrementChannel(channel: ColorChannel, stepSize: number): ColorType {
		const { minValue, maxValue, step } = this.getChannelRange(channel);
		const value = snapValueToStep(
			clampValue(this.getChannelValue(channel) + stepSize, minValue, maxValue),
			minValue,
			maxValue,
			step
		);
		return this.withChannelValue(channel, value);
	}

	decrementChannel(channel: ColorChannel, stepSize: number): ColorType {
		return this.incrementChannel(channel, -stepSize);
	}

	isEqual(color: ColorType): boolean {
		return (
			isEqualObject(this.toJSON(), color.toJSON()) &&
			this.getChannelValue('alpha') === color.getChannelValue('alpha')
		);
	}

	formatChannelValue(channel: ColorChannel, locale: string): string {
		const options = this.getChannelFormatOptions(channel);
		let value = this.getChannelValue(channel);
		if (channel === 'saturation' || channel === 'lightness' || channel === 'brightness') value /= 100;
		return new Intl.NumberFormat(locale, options).format(value);
	}
}

const HEX_COLOR_REGEX = /^#[\da-f]+$/i;
const RGB_COLOR_REGEX = /^rgba?\((.*)\)$/;
const HEX_STARTING_REGEX = /[^#]/gi;

export class RGBColor extends Color {
	static colorChannels: [ColorChannel, ColorChannel, ColorChannel] = ['red', 'green', 'blue'];

	constructor(
		public red: number,
		public green: number,
		public blue: number,
		public alpha: number
	) {
		super();
	}

	static parse(value: string): RGBColor | undefined {
		let colors: number[] = [];
		if (HEX_COLOR_REGEX.test(value) && [4, 5, 7, 9].includes(value.length)) {
			const values = (value.length < 6 ? value.replace(HEX_STARTING_REGEX, '$&$&') : value)
				.slice(1)
				.split('');
			while (values.length > 0) colors.push(parseInt(values.splice(0, 2).join(''), 16));
			if (colors[3] !== undefined) colors[3] = colors[3] / 255;
		}
		const match = value.match(RGB_COLOR_REGEX);
		if (match?.[1]) {
			colors = match[1]
				.split(',')
				.map((chunk) => Number(chunk.trim()))
				.map((num, index) => clampValue(num, 0, index < 3 ? 255 : 1));
		}
		if (colors.length < 3) return undefined;
		return new RGBColor(colors[0], colors[1], colors[2], colors[3] ?? 1);
	}

	toString(format: ColorStringFormat = 'css'): string {
		switch (format) {
			case 'hex':
				return (
					'#' +
					(
						this.red.toString(16).padStart(2, '0') +
						this.green.toString(16).padStart(2, '0') +
						this.blue.toString(16).padStart(2, '0')
					).toUpperCase()
				);
			case 'hexa':
				return (
					'#' +
					(
						this.red.toString(16).padStart(2, '0') +
						this.green.toString(16).padStart(2, '0') +
						this.blue.toString(16).padStart(2, '0') +
						Math.round(this.alpha * 255)
							.toString(16)
							.padStart(2, '0')
					).toUpperCase()
				);
			case 'rgb':
				return `rgb(${this.red}, ${this.green}, ${this.blue})`;
			case 'css':
			case 'rgba':
				return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
			case 'hsl':
				return this.toHSL().toString('hsl');
			case 'hsb':
				return this.toHSB().toString('hsb');
			default:
				return this.toFormat(format).toString(format);
		}
	}

	toFormat(format: ColorFormat): ColorType {
		switch (format) {
			case 'rgba':
				return this;
			case 'hsba':
				return this.toHSB();
			case 'hsla':
				return this.toHSL();
			default:
				throw new Error('Unsupported color conversion: rgb -> ' + format);
		}
	}

	toHexInt(): number {
		return (this.red << 16) | (this.green << 8) | this.blue;
	}

	toHSB(): HSBColor {
		const red = this.red / 255;
		const green = this.green / 255;
		const blue = this.blue / 255;
		const minValue = Math.min(red, green, blue);
		const brightness = Math.max(red, green, blue);
		const chroma = brightness - minValue;
		const saturation = brightness === 0 ? 0 : chroma / brightness;
		let hue = 0;
		if (chroma !== 0) {
			switch (brightness) {
				case red:
					hue = (green - blue) / chroma + (green < blue ? 6 : 0);
					break;
				case green:
					hue = (blue - red) / chroma + 2;
					break;
				case blue:
					hue = (red - green) / chroma + 4;
			}
			hue /= 6;
		}
		return new HSBColor(
			toFixedNumber(hue * 360, 2),
			toFixedNumber(saturation * 100, 2),
			toFixedNumber(brightness * 100, 2),
			toFixedNumber(this.alpha, 2)
		);
	}

	toHSL(): HSLColor {
		const red = this.red / 255;
		const green = this.green / 255;
		const blue = this.blue / 255;
		const minValue = Math.min(red, green, blue);
		const maxValue = Math.max(red, green, blue);
		const lightness = (maxValue + minValue) / 2;
		const chroma = maxValue - minValue;
		let hue = -1;
		let saturation = -1;
		if (chroma === 0) hue = saturation = 0;
		else {
			saturation = chroma / (lightness < 0.5 ? maxValue + minValue : 2 - maxValue - minValue);
			switch (maxValue) {
				case red:
					hue = (green - blue) / chroma + (green < blue ? 6 : 0);
					break;
				case green:
					hue = (blue - red) / chroma + 2;
					break;
				case blue:
					hue = (red - green) / chroma + 4;
			}
			hue /= 6;
		}
		return new HSLColor(
			toFixedNumber(hue * 360, 2),
			toFixedNumber(saturation * 100, 2),
			toFixedNumber(lightness * 100, 2),
			toFixedNumber(this.alpha, 2)
		);
	}

	clone(): RGBColor {
		return new RGBColor(this.red, this.green, this.blue, this.alpha);
	}

	getChannelFormatOptions(channel: ColorChannel): Intl.NumberFormatOptions {
		switch (channel) {
			case 'red':
			case 'green':
			case 'blue':
				return { style: 'decimal' };
			case 'alpha':
				return { style: 'percent' };
			default:
				throw new Error('Unknown color channel: ' + channel);
		}
	}

	getChannelValue(channel: ColorChannel): number {
		switch (channel) {
			case 'red':
				return this.red;
			case 'green':
				return this.green;
			case 'blue':
				return this.blue;
			case 'alpha':
				return this.alpha;
			default:
				throw new Error('Unsupported color channel: ' + channel);
		}
	}

	protected setChannelValue(channel: ColorChannel, value: number) {
		switch (channel) {
			case 'red':
				this.red = value;
				return;
			case 'green':
				this.green = value;
				return;
			case 'blue':
				this.blue = value;
				return;
			case 'alpha':
				this.alpha = value;
				return;
			default:
				throw new Error('Unsupported color channel: ' + channel);
		}
	}

	getChannelRange(channel: ColorChannel): ColorChannelRange {
		switch (channel) {
			case 'red':
			case 'green':
			case 'blue':
				return { minValue: 0, maxValue: 255, step: 1, pageSize: 17 };
			case 'alpha':
				return { minValue: 0, maxValue: 1, step: 0.01, pageSize: 0.1 };
			default:
				throw new Error('Unknown color channel: ' + channel);
		}
	}

	toJSON(): Record<string, number> {
		return { r: this.red, g: this.green, b: this.blue, a: this.alpha };
	}

	getFormat(): ColorFormat {
		return 'rgba';
	}

	getChannels() {
		return RGBColor.colorChannels;
	}
}

export const HSL_REGEX =
	/hsl\(([-+]?\d+(?:.\d+)?\s*,\s*[-+]?\d+(?:.\d+)?%\s*,\s*[-+]?\d+(?:.\d+)?%)\)|hsla\(([-+]?\d+(?:.\d+)?\s*,\s*[-+]?\d+(?:.\d+)?%\s*,\s*[-+]?\d+(?:.\d+)?%\s*,\s*[-+]?\d(.\d+)?)\)/;

export class HSLColor extends Color {
	static colorChannels: [ColorChannel, ColorChannel, ColorChannel] = ['hue', 'saturation', 'lightness'];

	constructor(
		public hue: number,
		public saturation: number,
		public lightness: number,
		public alpha: number
	) {
		super();
	}

	static parse(value: string): HSLColor | undefined {
		const match = value.match(HSL_REGEX);
		if (!match) return undefined;
		const [h, s, l, a] = (match[1] ?? match[2])
			.split(',')
			.map((chunk) => Number(chunk.trim().replace('%', '')));
		return new HSLColor(mod(h, 360), clampValue(s, 0, 100), clampValue(l, 0, 100), clampValue(a ?? 1, 0, 1));
	}

	toString(format: ColorStringFormat = 'css'): string {
		switch (format) {
			case 'hex':
				return this.toRGB().toString('hex');
			case 'hexa':
				return this.toRGB().toString('hexa');
			case 'hsl':
				return `hsl(${this.hue}, ${toFixedNumber(this.saturation, 2)}%, ${toFixedNumber(this.lightness, 2)}%)`;
			case 'css':
			case 'hsla':
				return `hsla(${this.hue}, ${toFixedNumber(this.saturation, 2)}%, ${toFixedNumber(this.lightness, 2)}%, ${this.alpha})`;
			case 'hsb':
				return this.toHSB().toString('hsb');
			case 'rgb':
				return this.toRGB().toString('rgb');
			default:
				return this.toFormat(format).toString(format);
		}
	}

	toFormat(format: ColorFormat): ColorType {
		switch (format) {
			case 'hsla':
				return this;
			case 'hsba':
				return this.toHSB();
			case 'rgba':
				return this.toRGB();
			default:
				throw new Error('Unsupported color conversion: hsl -> ' + format);
		}
	}

	toHSB(): HSBColor {
		let saturation = this.saturation / 100;
		const lightness = this.lightness / 100;
		const brightness = lightness + saturation * Math.min(lightness, 1 - lightness);
		saturation = brightness === 0 ? 0 : 2 * (1 - lightness / brightness);
		return new HSBColor(
			toFixedNumber(this.hue, 2),
			toFixedNumber(saturation * 100, 2),
			toFixedNumber(brightness * 100, 2),
			toFixedNumber(this.alpha, 2)
		);
	}

	toRGB(): RGBColor {
		const hue = this.hue;
		const saturation = this.saturation / 100;
		const lightness = this.lightness / 100;
		const a = saturation * Math.min(lightness, 1 - lightness);
		const fn = (n: number, k = (n + hue / 30) % 12) =>
			lightness - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return new RGBColor(
			Math.round(fn(0) * 255),
			Math.round(fn(8) * 255),
			Math.round(fn(4) * 255),
			toFixedNumber(this.alpha, 2)
		);
	}

	clone(): HSLColor {
		return new HSLColor(this.hue, this.saturation, this.lightness, this.alpha);
	}

	getChannelFormatOptions(channel: ColorChannel): Intl.NumberFormatOptions {
		switch (channel) {
			case 'hue':
				return { style: 'unit', unit: 'degree', unitDisplay: 'narrow' };
			case 'saturation':
			case 'lightness':
			case 'alpha':
				return { style: 'percent' };
			default:
				throw new Error('Unknown color channel: ' + channel);
		}
	}

	getChannelValue(channel: ColorChannel): number {
		switch (channel) {
			case 'hue':
				return this.hue;
			case 'saturation':
				return this.saturation;
			case 'lightness':
				return this.lightness;
			case 'alpha':
				return this.alpha;
			default:
				throw new Error('Unsupported color channel: ' + channel);
		}
	}

	protected setChannelValue(channel: ColorChannel, value: number) {
		switch (channel) {
			case 'hue':
				this.hue = value;
				return;
			case 'saturation':
				this.saturation = value;
				return;
			case 'lightness':
				this.lightness = value;
				return;
			case 'alpha':
				this.alpha = value;
				return;
			default:
				throw new Error('Unsupported color channel: ' + channel);
		}
	}

	getChannelRange(channel: ColorChannel): ColorChannelRange {
		switch (channel) {
			case 'hue':
				return { minValue: 0, maxValue: 360, step: 1, pageSize: 15 };
			case 'saturation':
			case 'lightness':
				return { minValue: 0, maxValue: 100, step: 1, pageSize: 10 };
			case 'alpha':
				return { minValue: 0, maxValue: 1, step: 0.01, pageSize: 0.1 };
			default:
				throw new Error('Unknown color channel: ' + channel);
		}
	}

	toJSON(): Record<string, number> {
		return { h: this.hue, s: this.saturation, l: this.lightness, a: this.alpha };
	}

	getFormat(): ColorFormat {
		return 'hsla';
	}

	getChannels() {
		return HSLColor.colorChannels;
	}
}

const HSB_REGEX =
	/hsb\(([-+]?\d+(?:.\d+)?\s*,\s*[-+]?\d+(?:.\d+)?%\s*,\s*[-+]?\d+(?:.\d+)?%)\)|hsba\(([-+]?\d+(?:.\d+)?\s*,\s*[-+]?\d+(?:.\d+)?%\s*,\s*[-+]?\d+(?:.\d+)?%\s*,\s*[-+]?\d(.\d+)?)\)/;

export class HSBColor extends Color {
	static colorChannels: [ColorChannel, ColorChannel, ColorChannel] = ['hue', 'saturation', 'brightness'];

	constructor(
		public hue: number,
		public saturation: number,
		public brightness: number,
		public alpha: number
	) {
		super();
	}

	static parse(value: string): HSBColor | undefined {
		const match = value.match(HSB_REGEX);
		if (!match) return undefined;
		const [h, s, b, a] = (match[1] ?? match[2])
			.split(',')
			.map((chunk) => Number(chunk.trim().replace('%', '')));
		return new HSBColor(mod(h, 360), clampValue(s, 0, 100), clampValue(b, 0, 100), clampValue(a ?? 1, 0, 1));
	}

	toString(format: ColorStringFormat = 'css'): string {
		switch (format) {
			case 'css':
				return this.toHSL().toString('css');
			case 'hex':
				return this.toRGB().toString('hex');
			case 'hexa':
				return this.toRGB().toString('hexa');
			case 'hsb':
				return `hsb(${this.hue}, ${toFixedNumber(this.saturation, 2)}%, ${toFixedNumber(this.brightness, 2)}%)`;
			case 'hsba':
				return `hsba(${this.hue}, ${toFixedNumber(this.saturation, 2)}%, ${toFixedNumber(this.brightness, 2)}%, ${this.alpha})`;
			case 'hsl':
				return this.toHSL().toString('hsl');
			case 'rgb':
				return this.toRGB().toString('rgb');
			default:
				return this.toFormat(format).toString(format);
		}
	}

	toFormat(format: ColorFormat): ColorType {
		switch (format) {
			case 'hsba':
				return this;
			case 'hsla':
				return this.toHSL();
			case 'rgba':
				return this.toRGB();
			default:
				throw new Error('Unsupported color conversion: hsb -> ' + format);
		}
	}

	toHSL(): HSLColor {
		let saturation = this.saturation / 100;
		const brightness = this.brightness / 100;
		const lightness = brightness * (1 - saturation / 2);
		saturation = lightness === 0 || lightness === 1 ? 0 : (brightness - lightness) / Math.min(lightness, 1 - lightness);
		return new HSLColor(
			toFixedNumber(this.hue, 2),
			toFixedNumber(saturation * 100, 2),
			toFixedNumber(lightness * 100, 2),
			toFixedNumber(this.alpha, 2)
		);
	}

	toRGB(): RGBColor {
		const hue = this.hue;
		const saturation = this.saturation / 100;
		const brightness = this.brightness / 100;
		const fn = (n: number, k = (n + hue / 60) % 6) =>
			brightness - saturation * brightness * Math.max(Math.min(k, 4 - k, 1), 0);
		return new RGBColor(
			Math.round(fn(5) * 255),
			Math.round(fn(3) * 255),
			Math.round(fn(1) * 255),
			toFixedNumber(this.alpha, 2)
		);
	}

	clone(): HSBColor {
		return new HSBColor(this.hue, this.saturation, this.brightness, this.alpha);
	}

	getChannelFormatOptions(channel: ColorChannel): Intl.NumberFormatOptions {
		switch (channel) {
			case 'hue':
				return { style: 'unit', unit: 'degree', unitDisplay: 'narrow' };
			case 'saturation':
			case 'brightness':
			case 'alpha':
				return { style: 'percent' };
			default:
				throw new Error('Unknown color channel: ' + channel);
		}
	}

	getChannelValue(channel: ColorChannel): number {
		switch (channel) {
			case 'hue':
				return this.hue;
			case 'saturation':
				return this.saturation;
			case 'brightness':
				return this.brightness;
			case 'alpha':
				return this.alpha;
			default:
				throw new Error('Unsupported color channel: ' + channel);
		}
	}

	protected setChannelValue(channel: ColorChannel, value: number) {
		switch (channel) {
			case 'hue':
				this.hue = value;
				return;
			case 'saturation':
				this.saturation = value;
				return;
			case 'brightness':
				this.brightness = value;
				return;
			case 'alpha':
				this.alpha = value;
				return;
			default:
				throw new Error('Unsupported color channel: ' + channel);
		}
	}

	getChannelRange(channel: ColorChannel): ColorChannelRange {
		switch (channel) {
			case 'hue':
				return { minValue: 0, maxValue: 360, step: 1, pageSize: 15 };
			case 'saturation':
			case 'brightness':
				return { minValue: 0, maxValue: 100, step: 1, pageSize: 10 };
			case 'alpha':
				return { minValue: 0, maxValue: 1, step: 0.01, pageSize: 0.1 };
			default:
				throw new Error('Unknown color channel: ' + channel);
		}
	}

	toJSON(): Record<string, number> {
		return { h: this.hue, s: this.saturation, b: this.brightness, a: this.alpha };
	}

	getFormat(): ColorFormat {
		return 'hsba';
	}

	getChannels() {
		return HSBColor.colorChannels;
	}
}

const nativeColors =
	'aliceblue:f0f8ff,antiquewhite:faebd7,aqua:00ffff,aquamarine:7fffd4,azure:f0ffff,beige:f5f5dc,bisque:ffe4c4,black:000000,blanchedalmond:ffebcd,blue:0000ff,blueviolet:8a2be2,brown:a52a2a,burlywood:deb887,cadetblue:5f9ea0,chartreuse:7fff00,chocolate:d2691e,coral:ff7f50,cornflowerblue:6495ed,cornsilk:fff8dc,crimson:dc143c,cyan:00ffff,darkblue:00008b,darkcyan:008b8b,darkgoldenrod:b8860b,darkgray:a9a9a9,darkgreen:006400,darkkhaki:bdb76b,darkmagenta:8b008b,darkolivegreen:556b2f,darkorange:ff8c00,darkorchid:9932cc,darkred:8b0000,darksalmon:e9967a,darkseagreen:8fbc8f,darkslateblue:483d8b,darkslategray:2f4f4f,darkturquoise:00ced1,darkviolet:9400d3,deeppink:ff1493,deepskyblue:00bfff,dimgray:696969,dodgerblue:1e90ff,firebrick:b22222,floralwhite:fffaf0,forestgreen:228b22,fuchsia:ff00ff,gainsboro:dcdcdc,ghostwhite:f8f8ff,gold:ffd700,goldenrod:daa520,gray:808080,green:008000,greenyellow:adff2f,honeydew:f0fff0,hotpink:ff69b4,indianred:cd5c5c,indigo:4b0082,ivory:fffff0,khaki:f0e68c,lavender:e6e6fa,lavenderblush:fff0f5,lawngreen:7cfc00,lemonchiffon:fffacd,lightblue:add8e6,lightcoral:f08080,lightcyan:e0ffff,lightgoldenrodyellow:fafad2,lightgrey:d3d3d3,lightgreen:90ee90,lightpink:ffb6c1,lightsalmon:ffa07a,lightseagreen:20b2aa,lightskyblue:87cefa,lightslategray:778899,lightsteelblue:b0c4de,lightyellow:ffffe0,lime:00ff00,limegreen:32cd32,linen:faf0e6,magenta:ff00ff,maroon:800000,mediumaquamarine:66cdaa,mediumblue:0000cd,mediumorchid:ba55d3,mediumpurple:9370d8,mediumseagreen:3cb371,mediumslateblue:7b68ee,mediumspringgreen:00fa9a,mediumturquoise:48d1cc,mediumvioletred:c71585,midnightblue:191970,mintcream:f5fffa,mistyrose:ffe4e1,moccasin:ffe4b5,navajowhite:ffdead,navy:000080,oldlace:fdf5e6,olive:808000,olivedrab:6b8e23,orange:ffa500,orangered:ff4500,orchid:da70d6,palegoldenrod:eee8aa,palegreen:98fb98,paleturquoise:afeeee,palevioletred:d87093,papayawhip:ffefd5,peachpuff:ffdab9,peru:cd853f,pink:ffc0cb,plum:dda0dd,powderblue:b0e0e6,purple:800080,rebeccapurple:663399,red:ff0000,rosybrown:bc8f8f,royalblue:4169e1,saddlebrown:8b4513,salmon:fa8072,sandybrown:f4a460,seagreen:2e8b57,seashell:fff5ee,sienna:a0522d,silver:c0c0c0,skyblue:87ceeb,slateblue:6a5acd,slategray:708090,snow:fffafa,springgreen:00ff7f,steelblue:4682b4,tan:d2b48c,teal:008080,thistle:d8bfd8,tomato:ff6347,turquoise:40e0d0,violet:ee82ee,wheat:f5deb3,white:ffffff,whitesmoke:f5f5f5,yellow:ffff00,yellowgreen:9acd32';

const makeNativeColorMap = (source: string) => {
	const map = new Map<string, string>();
	for (const entry of source.split(',')) {
		const [key, value] = entry.split(':');
		map.set(key, `#${value}`);
		if (key.includes('gray')) map.set(key.replace('gray', 'grey'), `#${value}`);
	}
	return map;
};

const nativeColorMap = makeNativeColorMap(nativeColors);

export function parseColor(value: string): ColorType {
	const named = nativeColorMap.get(value);
	if (named) return parseColor(named);
	const result = RGBColor.parse(value) || HSBColor.parse(value) || HSLColor.parse(value);
	if (!result) {
		throw new Error('Invalid color value: ' + value);
	}
	return result;
}

export function normalizeColor(value: string | ColorType): ColorType {
	return typeof value === 'string' ? parseColor(value) : value;
}

// --- area gradient (verbatim port of @zag-js/color-utils) -------------------

type Orientation = [string, string];

const generateRGB_R = (orientation: Orientation, dir: boolean, zValue: number) => {
	const maskImage = `linear-gradient(to ${orientation[Number(!dir)]}, transparent, #000)`;
	return {
		areaStyles: {
			backgroundImage: `linear-gradient(to ${orientation[Number(dir)]},rgb(${zValue},0,0),rgb(${zValue},255,0))`
		},
		areaGradientStyles: {
			backgroundImage: `linear-gradient(to ${orientation[Number(dir)]},rgb(${zValue},0,255),rgb(${zValue},255,255))`,
			WebkitMaskImage: maskImage,
			maskImage
		}
	};
};

const generateRGB_G = (orientation: Orientation, dir: boolean, zValue: number) => {
	const maskImage = `linear-gradient(to ${orientation[Number(!dir)]}, transparent, #000)`;
	return {
		areaStyles: {
			backgroundImage: `linear-gradient(to ${orientation[Number(dir)]},rgb(0,${zValue},0),rgb(255,${zValue},0))`
		},
		areaGradientStyles: {
			backgroundImage: `linear-gradient(to ${orientation[Number(dir)]},rgb(0,${zValue},255),rgb(255,${zValue},255))`,
			WebkitMaskImage: maskImage,
			maskImage
		}
	};
};

const generateRGB_B = (orientation: Orientation, dir: boolean, zValue: number) => {
	const maskImage = `linear-gradient(to ${orientation[Number(!dir)]}, transparent, #000)`;
	return {
		areaStyles: {
			backgroundImage: `linear-gradient(to ${orientation[Number(dir)]},rgb(0,0,${zValue}),rgb(255,0,${zValue}))`
		},
		areaGradientStyles: {
			backgroundImage: `linear-gradient(to ${orientation[Number(dir)]},rgb(0,255,${zValue}),rgb(255,255,${zValue}))`,
			WebkitMaskImage: maskImage,
			maskImage
		}
	};
};

const generateHSL_H = (orientation: Orientation, dir: boolean, zValue: number) => ({
	areaStyles: {},
	areaGradientStyles: {
		background: [
			`linear-gradient(to ${orientation[Number(dir)]}, hsla(0,0%,0%,1) 0%, hsla(0,0%,0%,0) 50%, hsla(0,0%,100%,0) 50%, hsla(0,0%,100%,1) 100%)`,
			`linear-gradient(to ${orientation[Number(!dir)]},hsl(0,0%,50%),hsla(0,0%,50%,0))`,
			`hsl(${zValue}, 100%, 50%)`
		].join(',')
	}
});

const generateHSL_S = (orientation: Orientation, dir: boolean, alphaValue: number) => ({
	areaStyles: {},
	areaGradientStyles: {
		background: [
			`linear-gradient(to ${orientation[Number(!dir)]}, hsla(0,0%,0%,${alphaValue}) 0%, hsla(0,0%,0%,0) 50%, hsla(0,0%,100%,0) 50%, hsla(0,0%,100%,${alphaValue}) 100%)`,
			`linear-gradient(to ${orientation[Number(dir)]},hsla(0,100%,50%,${alphaValue}),hsla(60,100%,50%,${alphaValue}),hsla(120,100%,50%,${alphaValue}),hsla(180,100%,50%,${alphaValue}),hsla(240,100%,50%,${alphaValue}),hsla(300,100%,50%,${alphaValue}),hsla(359,100%,50%,${alphaValue}))`,
			'hsl(0, 0%, 50%)'
		].join(',')
	}
});

const generateHSL_L = (orientation: Orientation, dir: boolean, zValue: number) => ({
	areaStyles: {},
	areaGradientStyles: {
		backgroundImage: [
			`linear-gradient(to ${orientation[Number(!dir)]},hsl(0,0%,${zValue}%),hsla(0,0%,${zValue}%,0))`,
			`linear-gradient(to ${orientation[Number(dir)]},hsl(0,100%,${zValue}%),hsl(60,100%,${zValue}%),hsl(120,100%,${zValue}%),hsl(180,100%,${zValue}%),hsl(240,100%,${zValue}%),hsl(300,100%,${zValue}%),hsl(360,100%,${zValue}%))`
		].join(',')
	}
});

const generateHSB_H = (orientation: Orientation, dir: boolean, zValue: number) => ({
	areaStyles: {},
	areaGradientStyles: {
		background: [
			`linear-gradient(to ${orientation[Number(dir)]},hsl(0,0%,0%),hsla(0,0%,0%,0))`,
			`linear-gradient(to ${orientation[Number(!dir)]},hsl(0,0%,100%),hsla(0,0%,100%,0))`,
			`hsl(${zValue}, 100%, 50%)`
		].join(',')
	}
});

const generateHSB_S = (orientation: Orientation, dir: boolean, alphaValue: number) => ({
	areaStyles: {},
	areaGradientStyles: {
		background: [
			`linear-gradient(to ${orientation[Number(!dir)]},hsla(0,0%,0%,${alphaValue}),hsla(0,0%,0%,0))`,
			`linear-gradient(to ${orientation[Number(dir)]},hsla(0,100%,50%,${alphaValue}),hsla(60,100%,50%,${alphaValue}),hsla(120,100%,50%,${alphaValue}),hsla(180,100%,50%,${alphaValue}),hsla(240,100%,50%,${alphaValue}),hsla(300,100%,50%,${alphaValue}),hsla(359,100%,50%,${alphaValue}))`,
			`linear-gradient(to ${orientation[Number(!dir)]},hsl(0,0%,0%),hsl(0,0%,100%))`
		].join(',')
	}
});

const generateHSB_B = (orientation: Orientation, dir: boolean, alphaValue: number) => ({
	areaStyles: {},
	areaGradientStyles: {
		background: [
			`linear-gradient(to ${orientation[Number(!dir)]},hsla(0,0%,100%,${alphaValue}),hsla(0,0%,100%,0))`,
			`linear-gradient(to ${orientation[Number(dir)]},hsla(0,100%,50%,${alphaValue}),hsla(60,100%,50%,${alphaValue}),hsla(120,100%,50%,${alphaValue}),hsla(180,100%,50%,${alphaValue}),hsla(240,100%,50%,${alphaValue}),hsla(300,100%,50%,${alphaValue}),hsla(359,100%,50%,${alphaValue}))`,
			'#000'
		].join(',')
	}
});

export interface AreaGradientOptions {
	xChannel: ColorChannel;
	yChannel: ColorChannel;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
}

export function getColorAreaGradient(color: ColorType, options: AreaGradientOptions) {
	const { xChannel, yChannel, dir: dirProp = 'ltr' } = options;
	const { zChannel } = color.getColorAxes({ xChannel, yChannel });
	const zValue = color.getChannelValue(zChannel);
	const { minValue: zMin, maxValue: zMax } = color.getChannelRange(zChannel);
	const orientation: Orientation = ['top', dirProp === 'rtl' ? 'left' : 'right'];
	let dir = false;
	let background: { areaStyles: StyleMap; areaGradientStyles: StyleMap } = {
		areaStyles: {},
		areaGradientStyles: {}
	};
	const alphaValue = (zValue - zMin) / (zMax - zMin);
	const isHSL = color.getFormat() === 'hsla';
	switch (zChannel) {
		case 'red':
			dir = xChannel === 'green';
			background = generateRGB_R(orientation, dir, zValue);
			break;
		case 'green':
			dir = xChannel === 'red';
			background = generateRGB_G(orientation, dir, zValue);
			break;
		case 'blue':
			dir = xChannel === 'red';
			background = generateRGB_B(orientation, dir, zValue);
			break;
		case 'hue':
			dir = xChannel !== 'saturation';
			background = isHSL ? generateHSL_H(orientation, dir, zValue) : generateHSB_H(orientation, dir, zValue);
			break;
		case 'saturation':
			dir = xChannel === 'hue';
			background = isHSL
				? generateHSL_S(orientation, dir, alphaValue)
				: generateHSB_S(orientation, dir, alphaValue);
			break;
		case 'brightness':
			dir = xChannel === 'hue';
			background = generateHSB_B(orientation, dir, alphaValue);
			break;
		case 'lightness':
			dir = xChannel === 'hue';
			background = generateHSL_L(orientation, dir, zValue);
	}
	return background;
}

// --- channel helpers (verbatim port of @zag-js/color-picker utils) ----------

export function getChannelValue(color: ColorType, channel: string | null): string {
	if (channel == null) return '';
	if (channel === 'hex') return color.toString('hex');
	if (channel === 'css') return color.toString('css');
	if (color.getChannels().includes(channel as ColorChannel)) {
		return color.getChannelValue(channel as ColorChannel).toString();
	}
	const isHSL = color.getFormat() === 'hsla';
	switch (channel) {
		case 'hue':
		case 'saturation':
			return (isHSL ? color.toFormat('hsla') : color.toFormat('hsba'))
				.getChannelValue(channel)
				.toString();
		case 'lightness':
			return color.toFormat('hsla').getChannelValue('lightness').toString();
		case 'brightness':
			return color.toFormat('hsba').getChannelValue('brightness').toString();
		case 'red':
		case 'green':
		case 'blue':
			return color.toFormat('rgba').getChannelValue(channel).toString();
		case 'alpha':
			return color.getChannelValue('alpha').toString();
		default:
			return '';
	}
}

export function getChannelRange(color: ColorType, channel: string): ColorChannelRange | undefined {
	switch (channel) {
		case 'hex': {
			const minColor = parseColor('#000000');
			const maxColor = parseColor('#FFFFFF');
			return { minValue: minColor.toHexInt(), maxValue: maxColor.toHexInt(), pageSize: 10, step: 1 };
		}
		case 'css':
			return undefined;
		case 'hue':
		case 'saturation':
		case 'lightness':
			return color.toFormat('hsla').getChannelRange(channel);
		case 'brightness':
			return color.toFormat('hsba').getChannelRange(channel);
		case 'red':
		case 'green':
		case 'blue':
			return color.toFormat('rgba').getChannelRange(channel);
		default:
			return color.getChannelRange(channel as ColorChannel);
	}
}

export function getChannelDisplayColor(color: ColorType, channel: ColorChannel): ColorType {
	switch (channel) {
		case 'hue':
			return parseColor(`hsl(${color.getChannelValue('hue')}, 100%, 50%)`);
		case 'lightness':
		case 'brightness':
		case 'saturation':
		case 'red':
		case 'green':
		case 'blue':
			return color.withChannelValue('alpha', 1);
		case 'alpha':
			return color;
		default:
			throw new Error('Unknown color channel: ' + channel);
	}
}

export interface SliderBackgroundOptions {
	channel: ColorChannel;
	value: ColorType;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	orientation?: 'horizontal' | 'vertical';
}

function getSliderBackgroundDirection(orientation: 'horizontal' | 'vertical', dir?: string | null) {
	if (orientation === 'vertical') return 'top';
	if (dir === 'ltr') return 'right';
	return 'left';
}

export function getSliderBackground(props: SliderBackgroundOptions): string {
	const { channel, value, dir, orientation = 'horizontal' } = props;
	const bgDirection = getSliderBackgroundDirection(orientation, dir);
	const { minValue, maxValue } = value.getChannelRange(channel);
	switch (channel) {
		case 'hue':
			return `linear-gradient(to ${bgDirection}, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)`;
		case 'lightness':
			return `linear-gradient(to ${bgDirection}, ${value.withChannelValue(channel, minValue).toString('css')}, ${value.withChannelValue(channel, (maxValue - minValue) / 2).toString('css')}, ${value.withChannelValue(channel, maxValue).toString('css')})`;
		case 'saturation':
		case 'brightness':
		case 'red':
		case 'green':
		case 'blue':
		case 'alpha':
			return `linear-gradient(to ${bgDirection}, ${value.withChannelValue(channel, minValue).toString('css')}, ${value.withChannelValue(channel, maxValue).toString('css')})`;
		default:
			throw new Error('Unknown color channel: ' + channel);
	}
}

const HEX_REGEX = /^[0-9a-fA-F]{3,8}$/;

export function isValidHex(value: string): boolean {
	return HEX_REGEX.test(value);
}

export function prefixHex(value: string): string {
	if (value.startsWith('#')) return value;
	if (isValidHex(value)) return `#${value}`;
	return value;
}
