import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import Phase6Chart from './harness/Phase6Chart.svelte';
import { chartColors } from '../src/lib/components/chart/index.js';

const $ = <T extends Element = HTMLElement>(selector: string) =>
	document.querySelector(selector) as T | null;
const $$ = <T extends Element = Element>(selector: string) =>
	Array.from(document.querySelectorAll(selector)) as T[];

const surface = () => $('.ts-chart-surface')!;

function svg() {
	return $('svg.ts-chart')!;
}

describe('Chart', () => {
	test('renders the composed figure contract', () => {
		render(Phase6Chart, { props: {} });

		const root = $('[data-scope="chart"][data-part="root"]')!;
		expect(root.tagName).toBe('FIGURE');
		expect(root.getAttribute('data-slot')).toBe('chart-root');

		const header = $('[data-part="header"]')!;
		expect(header.tagName).toBe('FIGCAPTION');
		expect(header.getAttribute('data-slot')).toBe('chart-header');
		expect($('[data-part="title"]')!.getAttribute('data-slot')).toBe('chart-title');
		expect($('[data-part="title"]')!.tagName).toBe('H3');
		expect($('[data-part="description"]')!.getAttribute('data-slot')).toBe('chart-description');
		expect($('[data-part="description"]')!.tagName).toBe('P');

		const legend = $('[data-part="legend"]')!;
		expect(legend.tagName).toBe('UL');
		expect(legend.getAttribute('data-slot')).toBe('chart-legend');
		expect(legend.getAttribute('aria-label')).toBe('Revenue series');

		const item = $('[data-part="legend-item"]')!;
		expect(item.tagName).toBe('LI');
		expect(item.getAttribute('data-slot')).toBe('chart-legend-item');
		expect(item.getAttribute('style')).toContain(
			'--moduix-chart-legend-indicator-color: var(--moduix-chart-1)'
		);

		expect(svg().getAttribute('role')).toBe('img');
		expect(svg().getAttribute('aria-label')).toBe('Monthly revenue');
		expect(svg().getAttribute('viewBox')).toBe('0 0 420 300');
	});

	test('exposes the eight-value theme palette', () => {
		expect(chartColors).toHaveLength(8);
		chartColors.forEach((color, index) => {
			expect(color).toBe(`var(--moduix-chart-${index + 1})`);
		});
	});

	test('renders inspectable geometry at exact coordinates', () => {
		render(Phase6Chart, { props: { variant: 'geometry', width: 100, height: 100 } });

		const path = $('path.ts-chart-line')!;
		expect(path.getAttribute('d')).toBe('M0,100 L100,0');
		expect(path.getAttribute('fill')).toBe('none');
		expect(path.getAttribute('stroke')).toBe('#111111');

		const circles = $$('circle.ts-chart-point');
		expect(circles).toHaveLength(2);
		expect(circles.map((circle) => circle.getAttribute('cx'))).toEqual(['0', '100']);
		expect(circles.map((circle) => circle.getAttribute('cy'))).toEqual(['0', '100']);
		expect(circles.every((circle) => circle.getAttribute('r') === '4')).toBe(true);

		expect($$('text')).toHaveLength(0);
	});

	test('draws axes, ticks and grid lines from the mark data', () => {
		render(Phase6Chart, { props: {} });

		const labels = $$('text.ts-chart-tick-label').map((node) => node.textContent);
		expect(labels).toEqual(['Jan', 'Feb', 'Mar', '0', '20', '40', '60', '80']);
		expect($$('text.ts-chart-axis-label').map((node) => node.textContent)).toEqual([
			'Month',
			'Revenue'
		]);

		expect($$('line.ts-chart-grid-line')).toHaveLength(5);

		const bars = $$('rect.ts-chart-bar');
		expect(bars).toHaveLength(3);
		expect(bars.map((bar) => Number(bar.getAttribute('height')))).toEqual([124, 248, 186]);
		expect(bars.every((bar) => bar.getAttribute('fill') === chartColors[0])).toBe(true);
		expect(Number(bars[0].getAttribute('width'))).toBe(86.4);
	});

	test('shows a hover tooltip near the pointer and clears it on leave', async () => {
		render(Phase6Chart, { props: {} });

		const bar = $('rect.ts-chart-bar')!;
		const x = Number(bar.getAttribute('x')) + Number(bar.getAttribute('width')) / 2;
		const y = Number(bar.getAttribute('y'));

		expect($('[data-slot="chart-tooltip-surface"]')).toBeNull();
		await fireEvent.pointerMove(surface(), { clientX: x, clientY: y });

		const tooltip = $('[data-slot="chart-tooltip-surface"]')!;
		expect(tooltip).not.toBeNull();
		expect(tooltip.getAttribute('style')).toContain(`left: ${x}px`);
		expect(tooltip.getAttribute('style')).toContain(`top: ${y}px`);

		expect($('[data-slot="chart-tooltip-title"]')!.textContent).toBe('Jan');
		const row = $('[data-slot="chart-tooltip-row"]')!;
		expect(row.hasAttribute('data-active')).toBe(true);
		expect($('[data-slot="chart-tooltip-label"]')!.textContent).toBe('Revenue');
		expect($('[data-slot="chart-tooltip-value"]')!.textContent).toBe('40');
		expect($('[data-slot="chart-tooltip-swatch"]')!.getAttribute('style')).toContain(
			`background-color: ${chartColors[0]}`
		);

		await fireEvent.pointerLeave(surface());
		expect($('[data-slot="chart-tooltip-surface"]')).toBeNull();
	});

	test('renders a custom tooltip body snippet', async () => {
		render(Phase6Chart, { props: { variant: 'geometry', width: 100, height: 100, customTooltip: true } });

		await fireEvent.pointerMove(surface(), { clientX: 0, clientY: 0 });

		expect($('[data-slot="chart-tooltip-body"]')).toBeNull();
		expect($('[data-testid="custom-tooltip"]')!.textContent).toBeDefined();
		expect($('[data-testid="custom-title"]')!.textContent).toBe('0');
		expect($('[data-testid="custom-rows"]')!.textContent).toBe('2');
		expect($('[data-testid="custom-points"]')!.textContent).toBe('2');
	});

	test('renders an empty chart without marks or a tooltip', async () => {
		render(Phase6Chart, { props: { variant: 'empty' } });

		expect(svg()).not.toBeNull();
		expect($$('rect')).toHaveLength(0);
		expect($$('path')).toHaveLength(0);
		expect($$('circle')).toHaveLength(0);
		expect($$('text.ts-chart-tick-label')).toHaveLength(0);

		await fireEvent.pointerMove(surface(), { clientX: 40, clientY: 40 });
		expect($('[data-slot="chart-tooltip-surface"]')).toBeNull();
	});

	test('motion=false renders the same static markup with no animation', () => {
		render(Phase6Chart, { props: { motion: false } });

		const host = $('.ts-chart-host')!;
		expect(host.getAttribute('data-motion')).toBe('false');
		expect(host.getAttribute('style')).toContain('position: relative');
		expect($$('rect.ts-chart-bar')).toHaveLength(3);
		expect($$('animate, animateTransform, animateMotion')).toHaveLength(0);
		expect(svg().getAttribute('style')).toBeNull();
	});
});
