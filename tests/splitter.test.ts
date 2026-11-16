import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import SplitterBasic from './harness/SplitterBasic.svelte';

const $ = (selector: string) => document.querySelector(selector) as HTMLElement | null;
const $$ = (selector: string) => [...document.querySelectorAll(selector)] as HTMLElement[];

describe('Splitter', () => {
	test('renders the Ark contract', () => {
		render(SplitterBasic, { props: {} });

		const root = $('[data-scope="splitter"][data-part="root"]')!;
		expect(root.getAttribute('data-slot')).toBe('splitter-root');
		expect(root.getAttribute('data-orientation')).toBe('horizontal');
		expect(root.hasAttribute('data-dragging')).toBe(false);

		const panels = $$('[data-part="panel"]');
		expect(panels).toHaveLength(3);
		expect(panels[0].getAttribute('data-index')).toBe('0');
		expect(panels[0].getAttribute('data-id')).toBe('a');
		expect(panels[0].getAttribute('data-ownedby')).toBe(root.id);
		expect(panels[0].style.flexGrow).toBe('33.3');

		const triggers = $$('[data-part="resize-trigger"]');
		expect(triggers).toHaveLength(2);
		expect(triggers[0].getAttribute('role')).toBe('separator');
		expect(triggers[0].getAttribute('aria-orientation')).toBe('vertical');
		expect(triggers[0].getAttribute('aria-valuenow')).toBe('33');
		expect(triggers[0].getAttribute('tabindex')).toBe('0');
		expect(triggers[0].getAttribute('aria-controls')).toBe(
			`${root.id}:panel:a ${root.id}:panel:b`
		);
		expect($$('[data-part="resize-trigger-indicator"]')).toHaveLength(2);
	});

	test('respects explicit sizes and vertical orientation', () => {
		render(SplitterBasic, { props: { orientation: 'vertical', size: [60, 40] } });

		const root = $('[data-part="root"]')!;
		expect(root.getAttribute('data-orientation')).toBe('vertical');

		const panels = $$('[data-part="panel"]');
		expect(panels[0].style.flexGrow).toBe('60');
		expect(panels[1].style.flexGrow).toBe('40');
		expect(panels[2].style.flexGrow).toBe('0');

		const trigger = $('[data-part="resize-trigger"]')!;
		expect(trigger.getAttribute('aria-orientation')).toBe('horizontal');
	});

	test('pointer drag resizes both panels', async () => {
		render(SplitterBasic, { props: { size: [50, 50] } });

		const root = $('[data-part="root"]')!;
		root.getBoundingClientRect = () => ({ width: 1000, height: 1000, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;

		const trigger = $$('[data-part="resize-trigger"]')[0];
		await fireEvent.pointerDown(trigger, { button: 0, clientX: 500, pointerId: 1 });
		expect(root.getAttribute('data-dragging')).toBe('');

		await fireEvent.pointerMove(window, { clientX: 620, pointerId: 1 });
		expect($$('[data-part="panel"]')[0].style.flexGrow).toBe('62');
		expect($$('[data-part="panel"]')[1].style.flexGrow).toBe('38');

		await fireEvent.pointerUp(window, { pointerId: 1 });
		expect(root.hasAttribute('data-dragging')).toBe(false);
	});

	test('keyboard resizing moves size between panels', async () => {
		render(SplitterBasic, { props: { size: [50, 50] } });

		const trigger = $$('[data-part="resize-trigger"]')[0];
		await fireEvent.keyDown(trigger, { key: 'ArrowRight' });

		const panels = $$('[data-part="panel"]');
		expect(panels[0].style.flexGrow).toBe('51');
		expect(panels[1].style.flexGrow).toBe('49');
		expect(trigger.getAttribute('aria-valuenow')).toBe('51');

		await fireEvent.keyDown(trigger, { key: 'ArrowRight', shiftKey: true });
		expect($$('[data-part="panel"]')[0].style.flexGrow).toBe('61');
	});
});
