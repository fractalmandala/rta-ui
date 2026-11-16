import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { flushSync, tick } from 'svelte';
import Harness from './harness/Phase4Popover.svelte';

const settle = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

const contentOf = () =>
	document.querySelector<HTMLElement>('[data-scope="popover"][data-part="content"]');

describe('popover', () => {
	test('renders the ark contract while closed', () => {
		render(Harness, {});

		const trigger = screen.getByRole('button', { name: /Open settings/ });
		expect(trigger.getAttribute('data-scope')).toBe('popover');
		expect(trigger.getAttribute('data-part')).toBe('trigger');
		expect(trigger.getAttribute('data-slot')).toBe('popover-trigger');
		expect(trigger.getAttribute('type')).toBe('button');
		expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
		expect(trigger.getAttribute('aria-expanded')).toBe('false');
		expect(trigger.getAttribute('data-state')).toBe('closed');
		expect(trigger.getAttribute('data-placement')).toBe('bottom');
		expect(trigger.getAttribute('data-ownedby')).toBeTruthy();
		expect(trigger.id).toBe(`popover:${trigger.getAttribute('data-ownedby')}:trigger`);
		expect(trigger.getAttribute('aria-controls')).toBe(
			`popover:${trigger.getAttribute('data-ownedby')}:content`
		);
		expect(contentOf()).toBeNull();
	});

	test('opens on click, portals the positioner and wires the content contract', async () => {
		const onOpenChange = vi.fn();
		render(Harness, { onOpenChange });

		const trigger = screen.getByRole('button', { name: /Open settings/ });
		await fireEvent.click(trigger);
		flushSync();

		expect(onOpenChange).toHaveBeenCalledWith({ open: true });
		expect(trigger.getAttribute('aria-expanded')).toBe('true');
		expect(trigger.getAttribute('data-state')).toBe('open');

		const content = contentOf()!;
		expect(content).toBeTruthy();
		expect(content.id).toBe(trigger.getAttribute('aria-controls'));
		expect(content.getAttribute('role')).toBe('dialog');
		expect(content.getAttribute('data-state')).toBe('open');
		expect(content.getAttribute('data-expanded')).toBe('');
		expect(content.getAttribute('data-placement')).toBe('bottom');
		expect(content.getAttribute('data-side')).toBe('bottom');
		expect(content.getAttribute('tabindex')).toBe('-1');
		expect(content.hasAttribute('hidden')).toBe(false);
		expect(content.getAttribute('aria-modal')).toBeNull();

		const title = document.querySelector('[data-scope="popover"][data-part="title"]')!;
		const description = document.querySelector('[data-scope="popover"][data-part="description"]')!;
		expect(content.getAttribute('aria-labelledby')).toBe(title.id);
		expect(content.getAttribute('aria-describedby')).toBe(description.id);
		expect(title.id).toBe(`popover:${trigger.getAttribute('data-ownedby')}:title`);
		expect(description.id).toBe(`popover:${trigger.getAttribute('data-ownedby')}:desc`);

		expect(content.closest('[data-rta-portal]')).toBeTruthy();
		expect(document.body.contains(content)).toBe(true);
		expect(screen.getByText('Notification settings')).toBeTruthy();

		const positioner = document.querySelector<HTMLElement>(
			'[data-scope="popover"][data-part="positioner"]'
		)!;
		expect(positioner.id).toBe(`popover:${trigger.getAttribute('data-ownedby')}:popper`);
		expect(positioner.style.position).toBe('absolute');
		expect(positioner.style.transform).toContain('translate3d');

		const arrow = document.querySelector<HTMLElement>('[data-scope="popover"][data-part="arrow"]')!;
		expect(arrow.parentElement).toBe(content);
		expect(content.parentElement).toBe(positioner);
		expect(arrow.style.position).toBe('absolute');
		expect(arrow.querySelector('[data-slot="popover-arrow-tip"]')).toBeTruthy();

		const indicator = document.querySelector('[data-scope="popover"][data-part="indicator"]')!;
		expect(indicator.getAttribute('data-state')).toBe('open');

		await settle();
		expect(document.activeElement).toBe(content);
	});

	test('closes on the close trigger and on Escape, returning focus to the trigger', async () => {
		const onOpenChange = vi.fn();
		render(Harness, { onOpenChange });

		const trigger = screen.getByRole('button', { name: /Open settings/ });
		await fireEvent.click(trigger);
		flushSync();

		const closeTrigger = screen.getByRole('button', { name: 'close' });
		expect(closeTrigger.getAttribute('data-slot')).toBe('popover-close-trigger');
		expect(closeTrigger.id).toBe(`popover:${trigger.getAttribute('data-ownedby')}:close`);
		expect(closeTrigger.getAttribute('type')).toBe('button');

		await fireEvent.click(closeTrigger);
		flushSync();

		expect(onOpenChange).toHaveBeenLastCalledWith({ open: false });
		expect(trigger.getAttribute('aria-expanded')).toBe('false');
		expect(contentOf()?.getAttribute('data-state')).toBe('closed');

		await settle();
		expect(contentOf()).toBeNull();

		await fireEvent.click(trigger);
		flushSync();
		contentOf()!.focus();

		await fireEvent.keyDown(document.body, { key: 'Escape' });
		flushSync();

		expect(onOpenChange).toHaveBeenLastCalledWith({ open: false });
		expect(trigger.getAttribute('data-state')).toBe('closed');

		await settle();
		expect(document.activeElement).toBe(trigger);
	});

	test('dismisses on an outside pointerdown unless closeOnInteractOutside is false', async () => {
		const { unmount } = render(Harness, {});
		const trigger = screen.getByRole('button', { name: /Open settings/ });

		await fireEvent.click(trigger);
		flushSync();
		expect(contentOf()).toBeTruthy();

		await fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));
		flushSync();
		expect(trigger.getAttribute('data-state')).toBe('closed');
		unmount();

		render(Harness, { defaultOpen: true, closeOnInteractOutside: false });
		flushSync();
		expect(contentOf()).toBeTruthy();

		await fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));
		flushSync();
		expect(contentOf()).toBeTruthy();
		expect(contentOf()!.getAttribute('data-state')).toBe('open');
	});

	test('honours positioning placement and portalled={false}', async () => {
		const { unmount } = render(Harness, {
			defaultOpen: true,
			positioning: { placement: 'top-start' }
		});
		flushSync();

		expect(contentOf()!.getAttribute('data-placement')).toBe('top-start');
		expect(contentOf()!.getAttribute('data-side')).toBe('top');
		expect(document.querySelector('[data-scope="popover"][data-part="arrow-tip"]')).toBeTruthy();
		unmount();

		const local = render(Harness, { defaultOpen: true, portalled: false });
		flushSync();

		const content = contentOf()!;
		expect(local.container.contains(content)).toBe(true);
		expect(document.querySelector('[data-rta-portal]')).toBeNull();
	});

	test('renders the close icon, anchor and modal contract', async () => {
		const { unmount } = render(Harness, { defaultOpen: true, modal: true });
		flushSync();

		const content = contentOf()!;
		expect(content.getAttribute('aria-modal')).toBe('true');
		expect(content.closest('[data-rta-portal]')).toBeTruthy();
		await settle();
		expect(document.activeElement).toBe(content);
		unmount();

		render(Harness, { defaultOpen: true, withAnchor: true, withCloseIcon: true });
		flushSync();

		const anchor = document.querySelector('[data-scope="popover"][data-part="anchor"]')!;
		expect(anchor.getAttribute('data-slot')).toBe('popover-anchor');

		const closeIcon = screen.getByRole('button', { name: 'Close popover' });
		expect(closeIcon.getAttribute('data-slot')).toBe('popover-close-icon');
		expect(closeIcon.getAttribute('data-part')).toBe('close-trigger');

		await fireEvent.click(closeIcon);
		flushSync();
		expect(contentOf()?.getAttribute('data-state')).toBe('closed');
	});

	test('keeps the content mounted but hidden when unmountOnExit is false', async () => {
		render(Harness, { defaultOpen: false, lazyMount: false, unmountOnExit: false });
		await tick();
		flushSync();

		const content = contentOf()!;
		expect(content).toBeTruthy();
		expect(content.hasAttribute('hidden')).toBe(true);
		expect(content.getAttribute('data-state')).toBe('closed');
	});
});
