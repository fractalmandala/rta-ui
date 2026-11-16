import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';

export type MarqueeSide = 'start' | 'end' | 'top' | 'bottom';

export interface MarqueePauseChangeDetails {
	paused: boolean;
}

export interface UseMarqueeProps {
	side?: MarqueeSide;
	speed?: number;
	delay?: number;
	loopCount?: number;
	spacing?: string;
	autoFill?: boolean;
	reverse?: boolean;
	pauseOnInteraction?: boolean;
	paused?: boolean;
	defaultPaused?: boolean;
	onPauseChange?: (details: MarqueePauseChangeDetails) => void;
	onLoopComplete?: () => void;
	onComplete?: () => void;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	translations?: { root?: string };
	id?: string | null;
}

export interface MarqueeApi {
	readonly paused: boolean;
	readonly reverse: boolean;
	readonly side: MarqueeSide;
	readonly orientation: 'horizontal' | 'vertical';
	readonly contentCount: number;
	readonly rootId: string;
	readonly viewportId: string;
	contentId(index: number): string;
	setPaused(next: boolean): void;
	togglePause(): void;
	pause(): void;
	resume(): void;
	restart(): void;
	rootAttrs(): Record<string, unknown>;
	viewportAttrs(): Record<string, unknown>;
	contentAttrs(index: number): Record<string, unknown>;
	edgeAttrs(side: MarqueeSide): Record<string, unknown>;
	itemAttrs(): Record<string, unknown>;
}

const marqueeContext = createContext<MarqueeApi>('Marquee', 'Marquee.Root');
export const useMarqueeContext = () => marqueeContext.get();
export const setMarqueeContext = (api: MarqueeApi) => marqueeContext.set(api);

function translateFor(side: MarqueeSide, dir: 'ltr' | 'rtl' | 'auto' | null | undefined) {
	if (side === 'top') return '-100%';
	if (side === 'bottom') return '100%';
	const forward = (side === 'start' && dir !== 'rtl') || (side === 'end' && dir === 'rtl');
	return forward ? '-100%' : '100%';
}

function edgePositionStyles(side: MarqueeSide): Record<string, string> {
	switch (side) {
		case 'start':
			return { top: '0', insetInlineStart: '0', height: '100%' };
		case 'end':
			return { top: '0', insetInlineEnd: '0', height: '100%' };
		case 'top':
			return { top: '0', insetInline: '0', width: '100%' };
		default:
			return { bottom: '0', insetInline: '0', width: '100%' };
	}
}

function serialize(style: Record<string, string | number>) {
	return Object.entries(style)
		.map(([name, value]) => `${name}: ${value}`)
		.join('; ');
}

export function createMarquee(getProps: () => UseMarqueeProps, uid: string): MarqueeApi {
	const rootId = () => getProps().id ?? `marquee:${uid}`;
	const viewportId = () => `${rootId()}:viewport`;
	const contentId = (index: number) => `${rootId()}:content:${index}`;
	const side = () => getProps().side ?? 'start';
	const orientation = () =>
		side() === 'top' || side() === 'bottom' ? ('vertical' as const) : ('horizontal' as const);

	let internalPaused = $state(getProps().defaultPaused ?? false);
	let restartCount = $state(0);

	const isControlled = () => getProps().paused !== undefined;
	const paused = () => (isControlled() ? Boolean(getProps().paused) : internalPaused);

	function setPaused(next: boolean) {
		if (!isControlled()) internalPaused = next;
		getProps().onPauseChange?.({ paused: next });
	}

	return {
		contentId,
		setPaused,
		togglePause() {
			setPaused(!paused());
		},
		pause() {
			setPaused(true);
		},
		resume() {
			setPaused(false);
		},
		restart() {
			restartCount += 1;
		},
		rootAttrs() {
			const vertical = orientation() === 'vertical';
			const duration = getProps().speed ?? 50;
			return {
				id: rootId(),
				dir: getProps().dir ?? undefined,
				role: 'region',
				'aria-roledescription': 'marquee',
				'aria-live': 'off',
				'aria-label': getProps().translations?.root ?? 'Marquee content',
				'data-state': paused() ? 'paused' : 'idle',
				'data-orientation': orientation(),
				'data-paused': dataAttr(paused()),
				'data-restart': restartCount > 0 ? String(restartCount) : undefined,
				style: serialize({
					display: 'flex',
					'flex-direction': vertical ? 'column' : 'row',
					position: 'relative',
					overflow: 'hidden',
					contain: 'layout style paint',
					'--marquee-duration': `${2000 / Math.max(0.001, duration)}s`,
					'--marquee-spacing': getProps().spacing ?? '1rem',
					'--marquee-delay': `${getProps().delay ?? 0}s`,
					'--marquee-loop-count':
						(getProps().loopCount ?? 0) === 0 ? 'infinite' : String(getProps().loopCount),
					'--marquee-translate': translateFor(side(), getProps().dir)
				})
			};
		},
		viewportAttrs() {
			return {
				id: viewportId(),
				'data-orientation': orientation(),
				'data-side': side(),
				style: serialize({
					display: 'flex',
					[orientation() === 'vertical' ? 'height' : 'width']: '100%',
					'flex-direction':
						orientation() === 'vertical'
							? side() === 'bottom'
								? 'column-reverse'
								: 'column'
							: side() === 'end'
								? 'row-reverse'
								: 'row'
				})
			};
		},
		contentAttrs(index: number) {
			const clone = index > 0;
			return {
				id: contentId(index),
				dir: getProps().dir ?? undefined,
				'data-index': index,
				'data-orientation': orientation(),
				'data-side': side(),
				'data-reverse': getProps().reverse ? '' : undefined,
				'data-clone': dataAttr(clone),
				role: clone ? 'presentation' : undefined,
				'aria-hidden': clone ? 'true' : undefined,
				style: serialize({
					display: 'flex',
					'flex-direction': orientation() === 'vertical' ? 'column' : 'row',
					'flex-shrink': '0',
					'backface-visibility': 'hidden',
					'will-change': paused() ? 'auto' : 'transform',
					transform: 'translateZ(0)',
					[orientation() === 'vertical' ? 'min-width' : 'min-height']: 'auto',
					contain: 'paint'
				})
			};
		},
		edgeAttrs(edge: MarqueeSide) {
			return {
				dir: getProps().dir ?? undefined,
				'data-side': edge,
				'data-orientation': orientation(),
				style: serialize({
					'pointer-events': 'none',
					position: 'absolute',
					...edgePositionStyles(edge)
				})
			};
		},
		itemAttrs() {
			return { dir: getProps().dir ?? undefined };
		},
		get paused() {
			return paused();
		},
		get reverse() {
			return Boolean(getProps().reverse);
		},
		get side() {
			return side();
		},
		get orientation() {
			return orientation();
		},
		get contentCount() {
			return 2;
		},
		get rootId() {
			return rootId();
		},
		get viewportId() {
			return viewportId();
		}
	};
}
