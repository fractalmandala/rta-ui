import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { tick } from 'svelte';
import Phase4Drawer from './harness/Phase4Drawer.svelte';
import Phase4DrawerProvider from './harness/Phase4DrawerProvider.svelte';
import type { DrawerApi } from '../src/lib/components/drawer/index';

const $ = (selector: string) => document.querySelector(selector) as HTMLElement | null;
const $$ = (selector: string) => [...document.querySelectorAll(selector)] as HTMLElement[];

// jsdom has no layout: give the drawer a viewport and a measured content box, then re-measure.
function mockGeometry(height = 600) {
	Object.defineProperty(document.documentElement, 'clientHeight', { value: 800, configurable: true });
	Object.defineProperty(document.documentElement, 'clientWidth', { value: 1200, configurable: true });
	for (const panel of $$('[data-part="content"]')) {
		panel.getBoundingClientRect = () =>
			({
				width: 400,
				height,
				top: 0,
				left: 0,
				right: 400,
				bottom: height,
				x: 0,
				y: 0,
				toJSON: () => ({})
			}) as DOMRect;
	}
	window.dispatchEvent(new Event('resize'));
}

async function openDrawer(props: Record<string, unknown> = {}, height = 600) {
	render(Phase4Drawer, { props });
	const trigger = $$('[data-part="trigger"]').at(-1)!;
	trigger.focus();
	await fireEvent.click(trigger);
	await tick();
	mockGeometry(height);
	await tick();
	return trigger;
}

const content = () => $$('[data-part="content"]').at(-1) ?? null;

afterEach(() => {
	vi.restoreAllMocks();
});

describe('Drawer', () => {
	test('applies ids and data hooks from the Zag contract', async () => {
		render(Phase4Drawer, { props: {} });

		const trigger = $('[data-scope="drawer"][data-part="trigger"]')!;
		expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
		expect(trigger.getAttribute('aria-expanded')).toBe('false');
		expect(trigger.hasAttribute('aria-controls')).toBe(false);

		const swipeArea = $('[data-slot="drawer-swipe-area"]')!;
		expect(swipeArea.getAttribute('role')).toBe('presentation');
		expect(swipeArea.getAttribute('aria-hidden')).toBe('true');
		expect(swipeArea.getAttribute('data-swipe-direction')).toBe('up');
		expect(swipeArea.getAttribute('touch-action' in swipeArea ? 'touch-action' : 'style')).toContain(
			'touch-action: pan-x'
		);

		await fireEvent.click(trigger);
		await tick();

		const panel = content()!;
		expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
		expect(panel.id).toMatch(/^drawer:.+:content$/);
		expect(panel.getAttribute('role')).toBe('dialog');
		expect(panel.getAttribute('aria-modal')).toBe('true');
		expect(panel.getAttribute('data-state')).toBe('open');
		expect(panel.getAttribute('data-swipe-direction')).toBe('down');
		expect(panel.getAttribute('data-slot')).toBe('drawer-content');

		const title = $('[data-part="title"]')!;
		expect(title.id).toBe(panel.id.replace(':content', ':title'));
		expect(panel.getAttribute('aria-labelledby')).toBe(title.id);
		expect(panel.getAttribute('aria-describedby')).toBe(panel.id.replace(':content', ':description'));

		expect($('[data-part="positioner"]')!.id).toBe(panel.id.replace(':content', ':positioner'));
		expect($('[data-part="backdrop"]')!.id).toBe(panel.id.replace(':content', ':backdrop'));
		expect($('[data-part="grabber"]')!.id).toBe(panel.id.replace(':content', ':grabber'));
		expect($('[data-part="grabber-indicator"]')!.id).toBe(
			panel.id.replace(':content', ':grabber-indicator')
		);
		expect($('[data-part="backdrop"]')!.getAttribute('data-state')).toBe('open');
		expect(document.body.style.overflow).toBe('hidden');
	});

	test('closes on escape and on the close trigger, restoring focus', async () => {
		const onOpenChange = vi.fn();
		const trigger = await openDrawer({ onOpenChange });

		await fireEvent.keyDown(document.body, { key: 'Escape' });
		await tick();

		expect(onOpenChange).toHaveBeenLastCalledWith({ open: false });
		await waitFor(() => expect(content()).toBeNull());
		expect(document.activeElement).toBe(trigger);
		expect(document.body.style.overflow).not.toBe('hidden');

		const reopened = await openDrawer({ onOpenChange });
		await fireEvent.click($('[data-slot="drawer-close-icon"]')!);
		await tick();
		expect(onOpenChange).toHaveBeenLastCalledWith({ open: false });
		expect(reopened.getAttribute('aria-expanded')).toBe('false');
	});

	test('resolves snap points into offsets and reports the active one', async () => {
		await openDrawer({ defaultSnapPoint: 0.5, snapPoints: [0.25, 0.5, 1] });

		const panel = content()!;
		expect(panel.getAttribute('data-snap-point')).toBe('0.5');
		expect(panel.style.getPropertyValue('--drawer-snap-point-offset-y')).toBe('200px');
		expect(panel.style.getPropertyValue('--drawer-translate-y')).toBe('200px');
		expect(panel.hasAttribute('data-expanded')).toBe(false);

		await openDrawer({ snapPoints: [1] });
		const full = content()!;
		expect(full.getAttribute('data-snap-point')).toBe('1');
		expect(full.style.getPropertyValue('--drawer-snap-point-offset-y')).toBe('0px');
		expect(full.hasAttribute('data-expanded')).toBe(true);
	});

	test('a downward drag on the content dismisses the drawer', async () => {
		const onOpenChange = vi.fn();
		await openDrawer({ onOpenChange, snapPoints: [1] });

		const panel = content()!;
		await fireEvent.pointerDown(panel, { button: 0, clientX: 200, clientY: 100 });
		await tick();
		await fireEvent.pointerMove(panel, { clientX: 200, clientY: 500 });
		await tick();

		expect(panel.hasAttribute('data-dragging')).toBe(true);
		expect(panel.hasAttribute('data-swiping')).toBe(true);
		expect(Number.parseFloat(panel.style.getPropertyValue('--drawer-translate-y'))).toBeGreaterThan(300);

		await fireEvent.pointerUp(panel, { clientX: 200, clientY: 500 });
		await tick();

		expect(onOpenChange).toHaveBeenLastCalledWith({ open: false });
		await waitFor(() => expect(content()).toBeNull());
	});

	test('a short drag falls back to the active snap point', async () => {
		await openDrawer({ defaultSnapPoint: 0.5, snapPoints: [0.5, 1] });

		const panel = content()!;
		await fireEvent.pointerDown(panel, { button: 0, clientX: 200, clientY: 100 });
		await fireEvent.pointerMove(panel, { clientX: 200, clientY: 130 });
		await fireEvent.pointerMove(panel, { clientX: 200, clientY: 150 });
		await tick();
		expect(panel.hasAttribute('data-dragging')).toBe(true);

		await fireEvent.pointerUp(panel, { clientX: 200, clientY: 150 });
		await tick();

		expect(panel.hasAttribute('data-dragging')).toBe(false);
		expect(panel.hasAttribute('data-swiping')).toBe(false);
		expect(panel.getAttribute('data-snap-point')).toBe('0.5');
		expect(panel.style.getPropertyValue('--drawer-snap-point-offset-y')).toBe('200px');
		expect(content()).not.toBeNull();
	});

	test('snapToSequentialPoints moves one snap point at a time', async () => {
		await openDrawer({
			defaultSnapPoint: 0.25,
			snapPoints: [0.25, 0.5, 1],
			snapToSequentialPoints: true
		});

		const panel = content()!;
		expect(panel.getAttribute('data-snap-point')).toBe('0.25');
		expect(panel.style.getPropertyValue('--drawer-snap-point-offset-y')).toBe('400px');

		await fireEvent.pointerDown(panel, { button: 0, clientX: 200, clientY: 400 });
		await fireEvent.pointerMove(panel, { clientX: 200, clientY: 360 });
		await fireEvent.pointerMove(panel, { clientX: 200, clientY: 350 });
		await fireEvent.pointerUp(panel, { clientX: 200, clientY: 350 });
		await tick();

		expect(content()).not.toBeNull();
		expect(panel.getAttribute('data-snap-point')).toBe('0.5');
		expect(panel.style.getPropertyValue('--drawer-snap-point-offset-y')).toBe('200px');
	});

	test('the root provider reports active and next snap point state', async () => {
		let api: DrawerApi | null = null;
		render(Phase4DrawerProvider, {
			props: {
				defaultSnapPoint: 0.25,
				snapPoints: [0.25, 0.5, 1],
				onApi: (value: DrawerApi) => (api = value)
			}
		});

		await fireEvent.click($('[data-part="trigger"]')!);
		await tick();
		mockGeometry();
		await tick();

		expect(api!.snapPoint).toBe(0.25);
		expect(api!.nextSnapPoint).toBe(0.25);
		expect(api!.getSnapPointIndex()).toBe(0);
		expect(api!.getOpenPercentage()).toBeCloseTo(1 - 400 / 600);
		expect(api!.getContentSize()).toBe(600);

		const panel = content()!;
		await fireEvent.pointerDown(panel, { button: 0, clientX: 200, clientY: 400 });
		await fireEvent.pointerMove(panel, { clientX: 200, clientY: 250 });
		await tick();

		expect(api!.dragging).toBe(true);
		expect(api!.snapPoint).toBe(0.25);
		expect(api!.nextSnapPoint).toBe(0.5);

		await fireEvent.pointerUp(panel, { clientX: 200, clientY: 250 });
		await tick();

		expect(api!.dragging).toBe(false);
		expect(api!.snapPoint).toBe(0.5);
		expect(api!.getSnapPointIndex()).toBe(1);
		expect(panel.getAttribute('data-snap-point')).toBe('0.5');
	});

	test('a non-modal drawer stays interactive and draggable={false} leaves dragging to the grabber', async () => {
		const onOpenChange = vi.fn();
		await openDrawer({ draggable: false, modal: false, onOpenChange, snapPoints: [1] });

		const panel = content()!;
		expect(panel.getAttribute('aria-modal')).toBe('false');
		expect(panel.style.pointerEvents).toBe('auto');
		expect(document.body.style.overflow).not.toBe('hidden');

		await fireEvent.pointerDown(panel, { button: 0, clientX: 200, clientY: 100 });
		await fireEvent.pointerMove(panel, { clientX: 200, clientY: 300 });
		await tick();
		expect(panel.hasAttribute('data-dragging')).toBe(false);

		const grabber = $('[data-part="grabber"]')!;
		await fireEvent.pointerDown(grabber, { button: 0, clientX: 200, clientY: 100 });
		await fireEvent.pointerMove(grabber, { clientX: 200, clientY: 600 });
		await tick();
		expect(panel.hasAttribute('data-dragging')).toBe(true);

		await fireEvent.pointerUp(grabber, { clientX: 200, clientY: 600 });
		await tick();
		expect(onOpenChange).toHaveBeenLastCalledWith({ open: false });
	});
});
