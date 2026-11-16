import { describe, expect, test } from 'vitest';
import {
	arrow,
	computePosition,
	flip,
	offset,
	sides,
	shift,
	transformOrigin,
	type Middleware,
	type Rect
} from '../../src/lib/internal/position';
import { arrowStyle, arrowTipStyle, floatingStyle, getOppositeSide, getSide } from '../../src/lib/internal/positioning.svelte';

function box(element: HTMLElement, rect: Partial<Rect>) {
	Object.defineProperty(element, 'getBoundingClientRect', {
		configurable: true,
		value: () => ({
			x: rect.x ?? 0,
			y: rect.y ?? 0,
			width: rect.width ?? 0,
			height: rect.height ?? 0,
			top: rect.y ?? 0,
			left: rect.x ?? 0,
			right: (rect.x ?? 0) + (rect.width ?? 0),
			bottom: (rect.y ?? 0) + (rect.height ?? 0),
			toJSON: () => ({})
		})
	});
	if (rect.width != null) {
		Object.defineProperty(element, 'offsetWidth', { configurable: true, value: rect.width });
	}
	if (rect.height != null) {
		Object.defineProperty(element, 'offsetHeight', { configurable: true, value: rect.height });
	}
}

function viewport(width = 1000, height = 800) {
	Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: width });
	Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, value: height });
}

describe('position', () => {
	test('bottom placement centers on the reference and clears the gutter', () => {
		viewport();
		const reference = document.createElement('button');
		const floating = document.createElement('div');
		box(reference, { x: 100, y: 100, width: 80, height: 40 });
		box(floating, { width: 200, height: 100 });

		const result = computePosition(reference, floating, {
			placement: 'bottom',
			middleware: [offset({ mainAxis: 8 })]
		});

		expect(result.placement).toBe('bottom');
		expect(result.x).toBe(40);
		expect(result.y).toBe(148);
	});

	test('start and end alignments snap to the reference edges', () => {
		viewport();
		const reference = document.createElement('button');
		const floating = document.createElement('div');
		box(reference, { x: 100, y: 100, width: 80, height: 40 });
		box(floating, { width: 300, height: 100 });

		const start = computePosition(reference, floating, { placement: 'bottom-start', middleware: [offset({ mainAxis: 4 })] });
		const end = computePosition(reference, floating, { placement: 'bottom-end', middleware: [offset({ mainAxis: 4 })] });

		expect(start.x).toBe(100);
		expect(end.x).toBe(-120);
		expect(start.y).toBe(144);
	});

	test('every side is offset along its own axis', () => {
		viewport();
		const reference = document.createElement('button');
		const floating = document.createElement('div');
		box(reference, { x: 400, y: 300, width: 100, height: 50 });
		box(floating, { width: 100, height: 50 });

		const coords = Object.fromEntries(
			sides.map((side) => {
				const result = computePosition(reference, floating, { placement: side, middleware: [offset({ mainAxis: 10 })] });
				return [side, [result.x, result.y]];
			})
		);

		expect(coords.top).toEqual([400, 240]);
		expect(coords.bottom).toEqual([400, 360]);
		expect(coords.left).toEqual([290, 300]);
		expect(coords.right).toEqual([510, 300]);
	});

	test('flip moves a popup that would overflow into the opposite side', () => {
		viewport(1000, 200);
		const reference = document.createElement('button');
		const floating = document.createElement('div');
		box(reference, { x: 100, y: 160, width: 100, height: 30 });
		box(floating, { width: 100, height: 150 });

		const result = computePosition(reference, floating, {
			placement: 'bottom',
			middleware: [offset({ mainAxis: 8 }), flip({ padding: 8 })]
		});

		expect(result.placement).toBe('top');
		expect(result.y).toBe(2);
	});

	test('shift keeps the popup inside the viewport', () => {
		viewport(300, 800);
		const reference = document.createElement('button');
		const floating = document.createElement('div');
		box(reference, { x: 280, y: 100, width: 20, height: 40 });
		box(floating, { width: 200, height: 100 });

		const result = computePosition(reference, floating, {
			placement: 'bottom',
			middleware: [offset({ mainAxis: 8 }), shift({ padding: 8 })]
		});

		expect(result.x).toBe(92);
	});

	test('arrow reports a clamped offset along the cross axis', () => {
		viewport();
		const reference = document.createElement('button');
		const floating = document.createElement('div');
		const arrowElement = document.createElement('span');
		box(reference, { x: 500, y: 100, width: 40, height: 20 });
		box(floating, { width: 200, height: 100 });
		box(arrowElement, { width: 10, height: 10 });

		const result = computePosition(reference, floating, {
			placement: 'bottom',
			middleware: [offset({ mainAxis: 8 }), arrow({ element: arrowElement, padding: 4 })]
		});

		// The arrow sits under the reference centre, then is clamped away from the popup edges.
		expect(result.middlewareData.arrow?.x).toBe(95);
	});

	test('rtl mirrors the cross-axis alignment', () => {
		viewport();
		const reference = document.createElement('button');
		const floating = document.createElement('div');
		box(reference, { x: 100, y: 100, width: 80, height: 40 });
		box(floating, { width: 300, height: 100 });

		const ltr = computePosition(reference, floating, { placement: 'bottom-start' });
		const rtl = computePosition(reference, floating, { placement: 'bottom-start', rtl: true });

		expect(ltr.x).toBe(100);
		expect(rtl.x).toBe(-120);
	});

	test('a middleware that returns nothing leaves the coordinates alone', () => {
		viewport();
		const reference = document.createElement('button');
		const floating = document.createElement('div');
		box(reference, { x: 10, y: 20, width: 30, height: 40 });
		box(floating, { width: 10, height: 10 });

		const noop: Middleware = { name: 'noop', fn: () => undefined };
		const result = computePosition(reference, floating, { placement: 'bottom', middleware: [noop] });

		expect(result.x).toBe(20);
		expect(result.y).toBe(60);
	});
});

describe('floating styles', () => {
	test('positioner style matches the Zag contract', () => {
		expect(floatingStyle({ strategy: 'absolute', placement: 'bottom' })).toBe(
			'position: absolute; isolation: isolate; min-width: max-content; top: 0px; left: 0px; transform: translate3d(var(--x, 0), var(--y, -100vh), 0);'
		);
	});

	test('unplaced content is parked off-screen and non-interactive', () => {
		const style = floatingStyle({});
		expect(style).toContain('pointer-events: none');
		expect(style).toContain('transform: translate3d(0, -100vh, 0)');
	});

	test('sameWidth and fitViewport read their custom properties', () => {
		const style = floatingStyle({ placement: 'bottom', sameWidth: true, fitViewport: true });
		expect(style).toContain('width: var(--reference-width)');
		expect(style).toContain('max-width: var(--available-width)');
		expect(style).toContain('max-height: var(--available-height)');
		expect(style).not.toContain('min-width: max-content');
	});

	test('arrow style and tip rotation follow the placement side', () => {
		expect(arrowStyle).toContain('--arrow-size-half: calc(var(--arrow-size) / 2)');
		expect(arrowTipStyle('top')).toContain('rotate(45deg)');
		expect(arrowTipStyle('bottom')).toContain('rotate(225deg)');
		expect(arrowTipStyle('left')).toContain('rotate(135deg)');
		expect(arrowTipStyle('right')).toContain('rotate(315deg)');
	});

	test('placement helpers split and invert sides', () => {
		expect(getSide('bottom-start')).toBe('bottom');
		expect(getOppositeSide('bottom-start')).toBe('top-start');
		expect(getOppositeSide('left')).toBe('right');
	});
});

describe('transformOrigin', () => {
	test('writes a side-relative origin', () => {
		viewport();
		const reference = document.createElement('button');
		const floating = document.createElement('div');
		box(reference, { x: 100, y: 100, width: 80, height: 40 });
		box(floating, { width: 200, height: 100 });

		const result = computePosition(reference, floating, { placement: 'bottom', middleware: [transformOrigin({ gutter: 8 })] });

		// A bottom placement puts the arrow on the popup's top edge, so the origin is offset upward.
		expect(floating.style.getPropertyValue('--transform-origin')).toBe('0px -8px');
		expect(result.middlewareData.transformOrigin).toBeTruthy();
	});
});

describe('coordinate origin', () => {
	test('a portalled popup is offset by the document scroll', () => {
		viewport();
		const reference = document.createElement('button');
		const floating = document.createElement('div');
		box(reference, { x: 100, y: 200, width: 80, height: 40 });
		box(floating, { width: 200, height: 100 });
		document.body.appendChild(floating);

		Object.defineProperty(window, 'scrollX', { configurable: true, value: 0 });
		Object.defineProperty(window, 'scrollY', { configurable: true, value: 900 });

		const result = computePosition(reference, floating, {
			placement: 'bottom',
			middleware: [offset({ mainAxis: 8 })]
		});

		// Without the scroll offset the popup renders 900px away from its trigger.
		expect(result.y).toBe(1148);
		floating.remove();
		Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
	});

	test('fixed strategy stays in viewport coordinates', () => {
		viewport();
		const reference = document.createElement('button');
		const floating = document.createElement('div');
		box(reference, { x: 10, y: 20, width: 30, height: 30 });
		box(floating, { width: 60, height: 20 });
		document.body.appendChild(floating);

		Object.defineProperty(window, 'scrollY', { configurable: true, value: 500 });
		const result = computePosition(reference, floating, { placement: 'bottom', strategy: 'fixed' });

		expect(result.y).toBe(50);
		floating.remove();
		Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
	});

	test('a positioned ancestor becomes the origin', () => {
		viewport();
		const host = document.createElement('div');
		host.style.position = 'relative';
		document.body.appendChild(host);
		box(host, { x: 50, y: 60, width: 400, height: 400 });

		const reference = document.createElement('button');
		const floating = document.createElement('div');
		host.appendChild(reference);
		host.appendChild(floating);
		box(reference, { x: 100, y: 200, width: 80, height: 40 });
		box(floating, { width: 200, height: 100 });

		const result = computePosition(reference, floating, { placement: 'bottom' });

		// The popup is placed inside the host, so its coordinates are host-relative.
		expect(result.x).toBe(-10);
		expect(result.y).toBe(180);
		host.remove();
	});
});
