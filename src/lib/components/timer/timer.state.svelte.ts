import { createContext } from '../../internal/context';

export type TimerTimePart = 'days' | 'hours' | 'minutes' | 'seconds';
export type TimerAction = 'start' | 'pause' | 'resume' | 'reset' | 'restart';

export interface TimerTime {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	milliseconds: number;
}

export interface TimerFormattedTime {
	days: string;
	hours: string;
	minutes: string;
	seconds: string;
	milliseconds: string;
}

export interface TimerTickDetails {
	value: number;
	time: TimerTime;
	formattedTime: TimerFormattedTime;
}

export interface TimerTranslations {
	areaLabel(time: TimerTime, formattedTime: TimerFormattedTime): string;
}

export interface TimerTimeSegment {
	days?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
	milliseconds?: number;
}

export interface UseTimerProps {
	autoStart?: boolean;
	countdown?: boolean;
	startMs?: number;
	targetMs?: number;
	interval?: number;
	id?: string | null;
	translations?: Partial<TimerTranslations>;
	onTick?: (details: TimerTickDetails) => void;
	onComplete?: () => void;
}

export interface TimerApi {
	readonly running: boolean;
	readonly paused: boolean;
	readonly time: TimerTime;
	readonly formattedTime: TimerFormattedTime;
	readonly progressPercent: number;
	readonly rootId: string;
	readonly areaId: string;
	start(): void;
	pause(): void;
	resume(): void;
	reset(): void;
	restart(): void;
	rootAttrs(): Record<string, unknown>;
	areaAttrs(): Record<string, unknown>;
	controlAttrs(): Record<string, unknown>;
	itemAttrs(type: TimerTimePart): Record<string, unknown>;
	itemLabelAttrs(type: TimerTimePart): Record<string, unknown>;
	itemValueAttrs(type: TimerTimePart): Record<string, unknown>;
	separatorAttrs(): Record<string, unknown>;
	actionTriggerAttrs(action: TimerAction): Record<string, unknown>;
}

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	return Object.fromEntries(
		Object.entries(value).filter(([, entry]) => entry !== undefined)
	) as T;
}

const defaultTranslations: TimerTranslations = {
	areaLabel: (time, formattedTime) =>
		`${time.days} days ${formattedTime.hours}:${formattedTime.minutes}:${formattedTime.seconds}`
};

function msToTime(ms: number): TimerTime {
	const time = Math.max(0, ms);
	return {
		days: Math.floor(time / 86400000),
		hours: Math.floor(time / 3600000) % 24,
		minutes: Math.floor(time / 60000) % 60,
		seconds: Math.floor(time / 1000) % 60,
		milliseconds: time % 1000
	};
}

function padStart(num: number, size = 2) {
	return num.toString().padStart(size, '0');
}

function formatTime(time: TimerTime): TimerFormattedTime {
	return {
		days: padStart(time.days),
		hours: padStart(time.hours),
		minutes: padStart(time.minutes),
		seconds: padStart(time.seconds),
		milliseconds: padStart(time.milliseconds, 3)
	};
}

function toPercent(value: number, minValue: number, maxValue: number) {
	const range = maxValue - minValue;
	if (range === 0) return 0;
	return (value - minValue) / range;
}

export function parseTime(value: number | string | Date | TimerTimeSegment): number {
	if (typeof value === 'number') return value;
	if (value instanceof Date) return value.getTime();
	if (typeof value === 'string') return new Date(value).getTime();
	const { days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0 } = value;
	return (days * 86400 + hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;
}

const timerContext = createContext<TimerApi>('Timer', 'Timer.Root');
export const useTimerContext = () => timerContext.get();
export const setTimerContext = (api: TimerApi) => timerContext.set(api);

export function createTimer(getProps: () => UseTimerProps, uid: string): TimerApi {
	const rootId = () => getProps().id ?? `timer:${uid}`;
	const areaId = () => `${rootId()}:area`;
	const interval = () => getProps().interval ?? 1000;
	const countdown = () => getProps().countdown ?? false;
	const startMs = () => getProps().startMs ?? 0;

	let currentMs = $state(startMs());
	let running = $state(getProps().autoStart ?? false);
	let paused = $state(false);
	let intervalId: ReturnType<typeof setInterval> | undefined;

	const time = () => msToTime(currentMs);
	const formattedTime = () => formatTime(time());
	const progressPercent = () => {
		const target = getProps().targetMs;
		if (target === undefined) return 0;
		return countdown()
			? toPercent(currentMs, target, startMs())
			: toPercent(currentMs, startMs(), target);
	};

	function clearTicking() {
		if (intervalId !== undefined) clearInterval(intervalId);
		intervalId = undefined;
	}

	function tick() {
		const sign = countdown() ? -1 : 1;
		const target = getProps().targetMs ?? (countdown() ? 0 : undefined);
		let next = currentMs + sign * interval();
		if (countdown() && target !== undefined) next = Math.max(next, target);
		else if (!countdown() && target !== undefined) next = Math.min(next, target);
		currentMs = next;
		getProps().onTick?.({ value: next, time: time(), formattedTime: formattedTime() });
		if (!countdown() && target !== undefined && next >= target) {
			clearTicking();
			running = false;
			getProps().onComplete?.();
		}
		if (countdown() && target !== undefined && next <= target) {
			clearTicking();
			running = false;
			getProps().onComplete?.();
		}
	}

	function startTicking() {
		clearTicking();
		intervalId = setInterval(tick, interval());
	}

	function resetTime() {
		currentMs = startMs();
	}

	function start() {
		resetTime();
		paused = false;
		running = true;
		startTicking();
	}

	function pause() {
		clearTicking();
		running = false;
		paused = true;
	}

	function resume() {
		if (!paused) return;
		paused = false;
		running = true;
		startTicking();
	}

	function reset() {
		clearTicking();
		running = false;
		paused = false;
		resetTime();
	}

	function restart() {
		start();
	}

	$effect(() => {
		if (running) startTicking();
		return clearTicking;
	});

	$effect(() => () => clearTicking());

	const translations = () => ({ ...defaultTranslations, ...getProps().translations });

	const actionHidden = (action: TimerAction) => {
		switch (action) {
			case 'start':
				return running || paused;
			case 'pause':
				return !running;
			case 'reset':
				return !running && !paused;
			case 'resume':
				return !paused;
			default:
				return false;
		}
	};

	return {
		start,
		pause,
		resume,
		reset,
		restart,
		rootAttrs: () => ({ id: rootId() }),
		areaAttrs: () =>
			dropUndefined({
				id: areaId(),
				role: 'timer',
				'aria-label': translations().areaLabel(time(), formattedTime()),
				'aria-atomic': true
			}),
		controlAttrs: () => ({}),
		itemAttrs: (type) => dropUndefined({ 'data-type': type, style: `--value: ${time()[type]};` }),
		itemLabelAttrs: (type) => ({ 'data-type': type }),
		itemValueAttrs: (type) => ({ 'data-type': type }),
		separatorAttrs: () => ({ 'aria-hidden': true }),
		actionTriggerAttrs: (action) =>
			dropUndefined({
				hidden: actionHidden(action),
				type: 'button',
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					({ start, pause, resume, reset, restart })[action]();
				}
			}),
		get running() {
			return running;
		},
		get paused() {
			return paused;
		},
		get time() {
			return time();
		},
		get formattedTime() {
			return formattedTime();
		},
		get progressPercent() {
			return progressPercent();
		},
		get rootId() {
			return rootId();
		},
		get areaId() {
			return areaId();
		}
	};
}
