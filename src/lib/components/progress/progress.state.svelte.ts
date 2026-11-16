import { createContext } from '../../internal/context';

export interface ProgressValueChangeDetails {
	value: number | null;
}

export interface UseProgressProps {
	value?: number | null;
	defaultValue?: number | null;
	min?: number;
	max?: number;
	orientation?: 'horizontal' | 'vertical';
	locale?: string;
	formatOptions?: Intl.NumberFormatOptions;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: { root?: string; label?: string; track?: string; circle?: string };
	translations?: { value?: (details: ProgressValueTextDetails) => string };
	onValueChange?: (details: ProgressValueChangeDetails) => void;
}

export interface ProgressValueTextDetails {
	value: number | null;
	min: number;
	max: number;
	percent: number;
	formatter: Intl.NumberFormat;
}

export interface ProgressApi {
	readonly value: number | null;
	readonly min: number;
	readonly max: number;
	readonly percent: number;
	readonly percentAsString: string;
	readonly valueAsString: string;
	readonly indeterminate: boolean;
	readonly state: 'indeterminate' | 'loading' | 'complete';
	readonly orientation: 'horizontal' | 'vertical';
	readonly rootId: string;
	readonly labelId: string;
	readonly trackId: string;
	readonly circleId: string;
	readonly radius: string;
	setValue(next: number | null): void;
	setToMax(): void;
	setToMin(): void;
	rootAttrs(): Record<string, unknown>;
	labelAttrs(): Record<string, unknown>;
	valueTextAttrs(): Record<string, unknown>;
	trackAttrs(): Record<string, unknown>;
	rangeAttrs(): Record<string, unknown>;
	circleAttrs(): Record<string, unknown>;
	circleTrackAttrs(): Record<string, unknown>;
	circleRangeAttrs(): Record<string, unknown>;
	viewAttrs(options: { state: 'indeterminate' | 'loading' | 'complete' }): Record<string, unknown>;
}

const progressContext = createContext<ProgressApi>('Progress', 'Progress.Root');
export const useProgressContext = () => progressContext.get();
export const setProgressContext = (api: ProgressApi) => progressContext.set(api);

const CIRCLE_STYLE = {
	'--radius': 'calc(var(--size) / 2 - var(--thickness) / 2)',
	cx: 'calc(var(--size) / 2)',
	cy: 'calc(var(--size) / 2)',
	r: 'var(--radius)',
	fill: 'transparent',
	'stroke-width': 'var(--thickness)'
} as const;

function serialize(style: Record<string, string | number | undefined>) {
	return Object.entries(style)
		.filter(([, value]) => value !== undefined)
		.map(([name, value]) => `${name}: ${value}`)
		.join('; ');
}

export function createProgress(getProps: () => UseProgressProps, uid: string): ProgressApi {
	const min = () => getProps().min ?? 0;
	const max = () => getProps().max ?? 100;
	const orientation = () => getProps().orientation ?? 'horizontal';
	const rootId = () => getProps().ids?.root ?? getProps().id ?? `progress:${uid}`;
	const labelId = () => getProps().ids?.label ?? `${rootId()}:label`;
	const trackId = () => getProps().ids?.track ?? `${rootId()}:track`;
	const circleId = () => getProps().ids?.circle ?? `${rootId()}:circle`;

	let internalValue = $state<number | null>(getProps().defaultValue ?? null);
	const controlled = () => getProps().value !== undefined;
	const value = () => (controlled() ? (getProps().value ?? null) : internalValue);

	const percent = () => {
		const current = value();
		if (current === null) return -1;
		return ((current - min()) / (max() - min())) * 100;
	};

	const formatter = $derived(
		new Intl.NumberFormat(getProps().locale, { style: 'percent', ...getProps().formatOptions })
	);

	const state = () => {
		const current = value();
		if (current === null) return 'indeterminate' as const;
		return current === max() ? ('complete' as const) : ('loading' as const);
	};

	const valueAsString = () => {
		const current = value();
		const details = {
			value: current,
			min: min(),
			max: max(),
			percent: percent(),
			formatter
		};
		const custom = getProps().translations?.value;
		if (custom) return custom(details);
		if (current === null) return 'loading...';
		const num = formatter.resolvedOptions().style === 'percent' ? percent() / 100 : current;
		return formatter.format(num);
	};

	function setValue(next: number | null) {
		const clamped = next === null ? null : Math.max(0, Math.min(next, max()));
		if (!controlled()) internalValue = clamped;
		getProps().onValueChange?.({ value: clamped });
	}

	const progressbarAttrs = () => ({
		role: 'progressbar',
		'aria-label': valueAsString(),
		'data-max': max(),
		'aria-valuemin': min(),
		'aria-valuemax': max(),
		'aria-valuenow': value() ?? undefined,
		'data-orientation': orientation(),
		'data-state': state()
	});

	return {
		setValue,
		setToMax() {
			setValue(max());
		},
		setToMin() {
			setValue(min());
		},
		rootAttrs() {
			return {
				id: rootId(),
				dir: getProps().dir ?? undefined,
				'data-max': max(),
				'data-value': value() ?? undefined,
				'data-state': state(),
				'data-orientation': orientation(),
				style: serialize({ '--percent': value() === null ? undefined : percent() })
			};
		},
		labelAttrs() {
			return { id: labelId(), dir: getProps().dir ?? undefined, 'data-orientation': orientation() };
		},
		valueTextAttrs() {
			return { dir: getProps().dir ?? undefined, 'aria-live': 'polite' };
		},
		trackAttrs() {
			return { id: trackId(), dir: getProps().dir ?? undefined, ...progressbarAttrs() };
		},
		rangeAttrs() {
			const indeterminate = value() === null;
			return {
				dir: getProps().dir ?? undefined,
				'data-orientation': orientation(),
				'data-state': state(),
				style: serialize({
					[orientation() === 'horizontal' ? 'width' : 'height']: indeterminate
						? undefined
						: `${percent()}%`
				})
			};
		},
		circleAttrs() {
			return {
				id: circleId(),
				dir: getProps().dir ?? undefined,
				...progressbarAttrs(),
				style: serialize({ width: 'var(--size)', height: 'var(--size)' })
			};
		},
		circleTrackAttrs() {
			return {
				dir: getProps().dir ?? undefined,
				'data-orientation': orientation(),
				style: serialize({ ...CIRCLE_STYLE })
			};
		},
		circleRangeAttrs() {
			return {
				dir: getProps().dir ?? undefined,
				'data-state': state(),
				opacity: value() === 0 ? 0 : undefined,
				style: serialize({
					...CIRCLE_STYLE,
					'--percent': percent(),
					'--circumference': 'calc(2 * 3.14159 * var(--radius))',
					'--offset': 'calc(var(--circumference) * (100 - var(--percent)) / 100)',
					'stroke-dashoffset': 'calc(var(--circumference) * ((100 - var(--percent)) / 100))',
					'stroke-dasharray': value() === null ? undefined : 'var(--circumference)',
					'transform-origin': 'center',
					transform: 'rotate(-90deg)'
				})
			};
		},
		viewAttrs({ state: viewState }) {
			return {
				dir: getProps().dir ?? undefined,
				'data-state': viewState,
				hidden: viewState !== state()
			};
		},
		get value() {
			return value();
		},
		get min() {
			return min();
		},
		get max() {
			return max();
		},
		get percent() {
			return percent();
		},
		get percentAsString() {
			return value() === null ? '' : formatter.format(percent() / 100);
		},
		get valueAsString() {
			return valueAsString();
		},
		get indeterminate() {
			return value() === null;
		},
		get state() {
			return state();
		},
		get orientation() {
			return orientation();
		},
		get rootId() {
			return rootId();
		},
		get labelId() {
			return labelId();
		},
		get trackId() {
			return trackId();
		},
		get circleId() {
			return circleId();
		},
		get radius() {
			return 'calc(var(--size) / 2 - var(--thickness) / 2)';
		}
	};
}
