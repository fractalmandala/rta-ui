import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import Harness from './harness/Phase4FloatingPanel.svelte';

const settle = () => new Promise((resolve) => setTimeout(resolve, 60));

const part = <T extends HTMLElement = HTMLElement>(name: string) =>
	document.querySelector<T & HTMLElement>(`[data-scope="floating-panel"][data-part="${name}"]`);

const contentOf = () => part('content');
const positionerOf = () => part('positioner');

const pointer = (type: string, init: PointerEventInit = {}) =>
	new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 1, ...init });

const openPanel = async () => {
	const trigger = screen.getByRole('button', { name: 'Open panel' });
	await fireEvent.click(trigger);
	flushSync();
	return trigger;
};

const styleVar = (element: HTMLElement, name: string) =>
	element.style.getPropertyValue(name).trim();

describe('floating-panel', () => {
	test('renders the ark contract while closed', () => {
		render(Harness, {});

		const trigger = screen.getByRole('button', { name: 'Open panel' });
		expect(trigger.getAttribute('data-scope')).toBe('floating-panel');
		expect(trigger.getAttribute('data-part')).toBe('trigger');
		expect(trigger.getAttribute('data-slot')).toBe('floating-panel-trigger');
		expect(trigger.getAttribute('type')).toBe('button');
		expect(trigger.getAttribute('data-state')).toBe('closed');
		expect(trigger.getAttribute('aria-expanded')).toBe('false');
		expect(trigger.hasAttribute('disabled')).toBe(false);

		const panelId = trigger.id.replace(/^float:(.+):trigger$/, '$1');
		expect(panelId).toBeTruthy();
		expect(panelId).not.toBe(trigger.id);
		expect(trigger.getAttribute('aria-controls')).toBeNull();
		expect(contentOf()).toBeNull();
		expect(positionerOf()).toBeNull();
	});

	test('opens, portals the positioner and anchors the panel inside the viewport', async () => {
		const onOpenChange = vi.fn();
		render(Harness, { onOpenChange });

		const trigger = await openPanel();
		expect(onOpenChange).toHaveBeenCalledWith({ open: true });

		const panelId = trigger.id.replace(/^float:(.+):trigger$/, '$1');
		expect(trigger.getAttribute('data-state')).toBe('open');
		expect(trigger.getAttribute('aria-expanded')).toBe('true');
		expect(trigger.getAttribute('aria-controls')).toBe(`float:${panelId}:content`);

		const positioner = positionerOf()!;
		expect(positioner.id).toBe(`float:${panelId}:positioner`);
		expect(positioner.closest('[data-rta-portal]')).toBeTruthy();
		expect(positioner.getAttribute('style')).toContain('position: fixed');
		expect(positioner.getAttribute('style')).toContain('isolation: isolate');
		expect(positioner.getAttribute('style')).toContain('top: var(--y)');
		expect(positioner.getAttribute('style')).toContain('left: var(--x)');
		// 1024x768 jsdom viewport with the default 320x240 panel, centred.
		expect(styleVar(positioner, '--x')).toBe('352px');
		expect(styleVar(positioner, '--y')).toBe('264px');
		expect(styleVar(positioner, '--width')).toBe('320px');
		expect(styleVar(positioner, '--height')).toBe('240px');
		expect(styleVar(positioner, '--z-index')).toBe('1');

		const content = contentOf()!;
		expect(content.parentElement).toBe(positioner);
		expect(content.id).toBe(`float:${panelId}:content`);
		expect(content.getAttribute('role')).toBe('dialog');
		expect(content.getAttribute('tabindex')).toBe('0');
		expect(content.getAttribute('data-slot')).toBe('floating-panel-content');
		expect(content.getAttribute('data-state')).toBe('open');
		expect(content.getAttribute('data-topmost')).toBe('');
		expect(content.hasAttribute('data-behind')).toBe(false);
		expect(content.hasAttribute('hidden')).toBe(false);
		expect(content.getAttribute('style')).toContain('width: var(--width)');

		const title = part('title')!;
		expect(title.id).toBe(`float:${panelId}:title`);
		expect(content.getAttribute('aria-labelledby')).toBe(title.id);
		expect(part('header')!.id).toBe(`float:${panelId}:header`);

		for (const name of ['header', 'body', 'control', 'drag-trigger', 'drag-indicator', 'footer']) {
			expect(part(name), name).toBeTruthy();
		}
		expect(part('footer')!.getAttribute('data-minimized')).toBeNull();

		await settle();
		expect(document.activeElement).toBe(content);
	});

	test('drags by the header through ownerDocument pointer listeners', async () => {
		const onPositionChangeEnd = vi.fn();
		render(Harness, { onPositionChangeEnd });
		await openPanel();

		const header = part('header')!;
		const content = contentOf()!;
		const positioner = positionerOf()!;

		header.dispatchEvent(pointer('pointerdown', { button: 0, clientX: 400, clientY: 300 }));
		flushSync();
		expect(header.getAttribute('data-dragging')).toBe('');
		expect(content.getAttribute('data-dragging')).toBe('');
		expect(positioner.getAttribute('style')).toContain('--x: 352px');

		document.dispatchEvent(pointer('pointermove', { clientX: 420, clientY: 310 }));
		flushSync();
		expect(styleVar(positioner, '--x')).toBe('372px');
		expect(styleVar(positioner, '--y')).toBe('274px');

		document.dispatchEvent(pointer('pointerup', { clientX: 420, clientY: 310 }));
		flushSync();
		expect(header.hasAttribute('data-dragging')).toBe(false);
		expect(onPositionChangeEnd).toHaveBeenCalledWith({ position: { x: 372, y: 274 } });

		// Listening on the document is enough: no listener survives the pointerup.
		document.dispatchEvent(pointer('pointermove', { clientX: 500, clientY: 400 }));
		flushSync();
		expect(styleVar(positioner, '--x')).toBe('372px');

		// The drag trigger is focusable and moves the panel with the arrow keys.
		const dragTrigger = part('drag-trigger')!;
		expect(dragTrigger.getAttribute('tabindex')).toBe('0');
		expect(dragTrigger.getAttribute('aria-label')).toBe('Move window');
		dragTrigger.focus();
		await fireEvent.keyDown(dragTrigger, { key: 'ArrowLeft' });
		flushSync();
		expect(styleVar(positioner, '--x')).toBe('371px');
	});

	test('resizes from every axis handle and writes the aria value contract', async () => {
		const onSizeChangeEnd = vi.fn();
		render(Harness, { onSizeChangeEnd });
		await openPanel();

		const handles = Array.from(document.querySelectorAll<HTMLElement>('[data-axis]'));
		expect(handles.map((handle) => handle.getAttribute('data-axis')).sort()).toEqual(
			['e', 'n', 'ne', 'nw', 's', 'se', 'sw', 'w'].sort()
		);
		for (const handle of handles) {
			expect(handle.getAttribute('data-part')).toBe('resize-trigger');
			expect(handle.getAttribute('data-slot')).toBe('floating-panel-resize-trigger');
			expect(handle.getAttribute('role')).toBe('separator');
			expect(handle.getAttribute('tabindex')).toBe('0');
			expect(handle.getAttribute('data-disabled')).toBeNull();
		}

		const positioner = positionerOf()!;
		const content = contentOf()!;
		const se = document.querySelector<HTMLElement>('[data-axis="se"]')!;
		expect(se.getAttribute('aria-valuenow')).toBe('320');
		expect(se.getAttribute('aria-valuemin')).toBe('0');
		expect(se.getAttribute('aria-controls')).toBe(content.id);

		se.dispatchEvent(pointer('pointerdown', { button: 0, clientX: 600, clientY: 500 }));
		flushSync();
		expect(se.getAttribute('style')).toContain('cursor: se-resize');
		document.dispatchEvent(pointer('pointermove', { clientX: 640, clientY: 530 }));
		flushSync();
		expect(styleVar(positioner, '--width')).toBe('360px');
		expect(styleVar(positioner, '--height')).toBe('270px');
		expect(styleVar(positioner, '--x')).toBe('352px');
		expect(se.getAttribute('aria-valuenow')).toBe('360');

		document.dispatchEvent(pointer('pointerup', { clientX: 640, clientY: 530 }));
		flushSync();
		expect(onSizeChangeEnd).toHaveBeenCalledWith({ size: { width: 360, height: 270 } });

		// The north handle grows the panel upwards.
		const north = document.querySelector<HTMLElement>('[data-axis="n"]')!;
		north.dispatchEvent(pointer('pointerdown', { button: 0, clientX: 500, clientY: 300 }));
		document.dispatchEvent(pointer('pointermove', { clientX: 500, clientY: 320 }));
		flushSync();
		expect(styleVar(positioner, '--y')).toBe('284px');
		expect(styleVar(positioner, '--height')).toBe('250px');
		document.dispatchEvent(pointer('pointerup', { clientX: 500, clientY: 320 }));
		flushSync();

		// Keyboard resizing on the focused handle.
		const east = document.querySelector<HTMLElement>('[data-axis="e"]')!;
		const before = Number.parseInt(east.getAttribute('aria-valuenow')!, 10);
		await fireEvent.keyDown(east, { key: 'ArrowRight' });
		flushSync();
		expect(Number.parseInt(east.getAttribute('aria-valuenow')!, 10)).toBe(before + 1);
		await fireEvent.keyDown(east, { key: 'ArrowRight', shiftKey: true });
		flushSync();
		expect(Number.parseInt(east.getAttribute('aria-valuenow')!, 10)).toBe(before + 11);
	});

	test('clamps every resize into minSize and maxSize', async () => {
		const { unmount } = render(Harness, { maxSize: { width: 400, height: 300 } });
		await openPanel();

		const positioner = positionerOf()!;
		const se = document.querySelector<HTMLElement>('[data-axis="se"]')!;
		se.dispatchEvent(pointer('pointerdown', { button: 0, clientX: 600, clientY: 500 }));
		document.dispatchEvent(pointer('pointermove', { clientX: 800, clientY: 700 }));
		flushSync();
		expect(styleVar(positioner, '--width')).toBe('400px');
		expect(styleVar(positioner, '--height')).toBe('300px');
		document.dispatchEvent(pointer('pointerup', { clientX: 800, clientY: 700 }));
		unmount();

		render(Harness, { minSize: { width: 260, height: 200 } });
		await openPanel();
		const shrinking = positionerOf()!;
		const handle = document.querySelector<HTMLElement>('[data-axis="se"]')!;
		handle.dispatchEvent(pointer('pointerdown', { button: 0, clientX: 600, clientY: 500 }));
		document.dispatchEvent(pointer('pointermove', { clientX: 400, clientY: 200 }));
		flushSync();
		expect(styleVar(shrinking, '--width')).toBe('260px');
		expect(styleVar(shrinking, '--height')).toBe('200px');
	});

	test('moves the panel with the keyboard and closes on Escape', async () => {
		const onOpenChange = vi.fn();
		render(Harness, { onOpenChange, gridSize: 2 });
		const trigger = await openPanel();

		const content = contentOf()!;
		const positioner = positionerOf()!;
		content.focus();

		await fireEvent.keyDown(content, { key: 'ArrowRight' });
		flushSync();
		expect(styleVar(positioner, '--x')).toBe('354px');

		await fireEvent.keyDown(content, { key: 'ArrowDown', shiftKey: true });
		flushSync();
		// Shift multiplies the step by ten, then the grid size multiplies again.
		expect(styleVar(positioner, '--y')).toBe('284px');

		await fireEvent.keyDown(content, { key: 'ArrowLeft' });
		flushSync();
		expect(styleVar(positioner, '--x')).toBe('352px');

		await fireEvent.keyDown(document.body, { key: 'Escape' });
		flushSync();
		expect(onOpenChange).toHaveBeenLastCalledWith({ open: false });
		expect(trigger.getAttribute('data-state')).toBe('closed');
		expect(content.getAttribute('data-state')).toBe('closed');
		expect(content.hasAttribute('hidden')).toBe(true);

		await settle();
		expect(contentOf()).toBeNull();
	});

	test('keeps the rect across close and reopen only when persistRect is set', async () => {
		const { unmount } = render(Harness, { persistRect: true });
		const trigger = await openPanel();

		const header = part('header')!;
		header.dispatchEvent(pointer('pointerdown', { button: 0, clientX: 400, clientY: 300 }));
		document.dispatchEvent(pointer('pointermove', { clientX: 420, clientY: 310 }));
		document.dispatchEvent(pointer('pointerup', { clientX: 420, clientY: 310 }));
		flushSync();
		expect(styleVar(positionerOf()!, '--x')).toBe('372px');

		await fireEvent.click(screen.getByRole('button', { name: 'Close panel' }));
		flushSync();
		await settle();
		expect(contentOf()).toBeNull();

		await fireEvent.click(trigger);
		flushSync();
		expect(styleVar(positionerOf()!, '--x')).toBe('372px');
		expect(styleVar(positionerOf()!, '--y')).toBe('274px');
		unmount();
		await settle();

		render(Harness, { persistRect: false });
		const resetTrigger = await openPanel();
		const resetHeader = part('header')!;
		resetHeader.dispatchEvent(pointer('pointerdown', { button: 0, clientX: 400, clientY: 300 }));
		document.dispatchEvent(pointer('pointermove', { clientX: 420, clientY: 310 }));
		document.dispatchEvent(pointer('pointerup', { clientX: 420, clientY: 310 }));
		flushSync();
		expect(styleVar(positionerOf()!, '--x')).toBe('372px');

		await fireEvent.click(screen.getByRole('button', { name: 'Close panel' }));
		flushSync();
		await settle();
		await fireEvent.click(resetTrigger);
		flushSync();
		expect(styleVar(positionerOf()!, '--x')).toBe('352px');
		expect(styleVar(positionerOf()!, '--y')).toBe('264px');
	});

	test('stages the panel through the control triggers', async () => {
		const onStageChange = vi.fn();
		const { unmount } = render(Harness, { onStageChange });
		await openPanel();

		const content = contentOf()!;
		const positioner = positionerOf()!;
		const restoreTrigger = () => document.querySelector('[data-part="stage-trigger"][data-stage="default"]')!;
		expect(restoreTrigger().hasAttribute('hidden')).toBe(true);

		await fireEvent.click(screen.getByRole('button', { name: 'Minimize window' }));
		flushSync();
		expect(onStageChange).toHaveBeenCalledWith({ stage: 'minimized' });
		expect(content.getAttribute('data-minimized')).toBe('');
		expect(part('body')!.hasAttribute('hidden')).toBe(true);
		expect(part('footer')!.getAttribute('data-minimized')).toBe('');
		expect(content.getAttribute('style')).toContain('overflow: hidden');
		expect(restoreTrigger().hasAttribute('hidden')).toBe(false);

		await fireEvent.click(screen.getByRole('button', { name: 'Restore window' }));
		flushSync();
		expect(content.hasAttribute('data-minimized')).toBe(false);
		expect(styleVar(positioner, '--height')).toBe('240px');

		await fireEvent.click(screen.getByRole('button', { name: 'Maximize window' }));
		flushSync();
		expect(content.getAttribute('data-maximized')).toBe('');
		expect(styleVar(positioner, '--width')).toBe('1024px');
		expect(styleVar(positioner, '--height')).toBe('768px');
		expect(styleVar(positioner, '--x')).toBe('0px');
		expect(restoreTrigger().hasAttribute('hidden')).toBe(false);

		await fireEvent.click(screen.getByRole('button', { name: 'Restore window' }));
		flushSync();
		expect(content.hasAttribute('data-maximized')).toBe(false);
		expect(styleVar(positioner, '--width')).toBe('320px');
		unmount();
		await settle();

		const defaults = { width: 400, height: 300 };
		const local = render(Harness, {
			defaultOpen: true,
			defaultSize: defaults,
			defaultPosition: { x: 40, y: 50 },
			portalled: false
		});
		flushSync();
		const inline = contentOf()!;
		expect(local.container.contains(inline)).toBe(true);
		expect(document.querySelector('[data-rta-portal]')).toBeNull();
		expect(styleVar(positionerOf()!, '--width')).toBe('400px');
		expect(styleVar(positionerOf()!, '--y')).toBe('50px');
	});
});
