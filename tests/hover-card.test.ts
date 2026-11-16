import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import Harness from './harness/Phase4HoverCard.svelte';

const settle = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

const contentOf = () =>
	document.querySelector<HTMLElement>('[data-scope="hover-card"][data-part="content"]');

describe('hover card', () => {
	test('renders the ark contract while closed', () => {
		render(Harness, {});

		const trigger = screen.getByRole('button', { name: '@sveltejs' });
		expect(trigger.getAttribute('data-scope')).toBe('hover-card');
		expect(trigger.getAttribute('data-part')).toBe('trigger');
		expect(trigger.getAttribute('data-slot')).toBe('hover-card-trigger');
		expect(trigger.getAttribute('type')).toBe('button');
		expect(trigger.getAttribute('data-state')).toBe('closed');
		expect(trigger.getAttribute('data-placement')).toBe('bottom');
		expect(trigger.getAttribute('data-side')).toBe('bottom');
		expect(trigger.getAttribute('data-ownedby')).toBeTruthy();
		expect(trigger.id).toBe(`hover-card:${trigger.getAttribute('data-ownedby')}:trigger`);
		expect(contentOf()).toBeNull();
	});

	test('opens after the open delay and portals the positioner', async () => {
		const onOpenChange = vi.fn();
		render(Harness, { openDelay: 20, onOpenChange });

		const trigger = screen.getByRole('button', { name: '@sveltejs' });
		await fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
		flushSync();

		expect(contentOf()).toBeNull();
		expect(onOpenChange).not.toHaveBeenCalled();

		await settle();
		flushSync();

		expect(onOpenChange).toHaveBeenCalledWith({ open: true });
		expect(trigger.getAttribute('data-state')).toBe('open');

		const content = contentOf()!;
		expect(content.id).toBe(`hover-card:${trigger.getAttribute('data-ownedby')}:content`);
		expect(content.getAttribute('data-state')).toBe('open');
		expect(content.getAttribute('data-placement')).toBe('bottom');
		expect(content.getAttribute('tabindex')).toBe('-1');
		expect(content.hasAttribute('hidden')).toBe(false);
		expect(content.closest('[data-rta-portal]')).toBeTruthy();
		expect(content.textContent).toContain('compiler-first');

		const positioner = document.querySelector<HTMLElement>(
			'[data-scope="hover-card"][data-part="positioner"]'
		)!;
		expect(positioner.id).toBe(`hover-card:${trigger.getAttribute('data-ownedby')}:popper`);
		expect(positioner.style.position).toBe('absolute');
		expect(content.parentElement).toBe(positioner);

		const arrow = document.querySelector<HTMLElement>('[data-scope="hover-card"][data-part="arrow"]')!;
		expect(arrow.getAttribute('data-slot')).toBe('hover-card-arrow');
		expect(arrow.querySelector('[data-slot="hover-card-arrow-tip"]')).toBeTruthy();
	});

	test('keeps the card open while the pointer crosses from the trigger onto the content', async () => {
		const onOpenChange = vi.fn();
		render(Harness, { openDelay: 0, closeDelay: 40, onOpenChange });

		const trigger = screen.getByRole('button', { name: '@sveltejs' });
		await fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
		await settle();
		flushSync();
		expect(contentOf()!.getAttribute('data-state')).toBe('open');

		await fireEvent.pointerLeave(trigger, { pointerType: 'mouse' });
		flushSync();
		expect(contentOf()!.getAttribute('data-state')).toBe('open');

		await fireEvent.pointerEnter(contentOf()!, { pointerType: 'mouse' });
		await settle();
		flushSync();

		expect(contentOf()!.getAttribute('data-state')).toBe('open');
		expect(onOpenChange).toHaveBeenCalledTimes(1);
		expect(onOpenChange).toHaveBeenCalledWith({ open: true });

		await fireEvent.pointerLeave(contentOf()!, { pointerType: 'mouse' });
		await settle();
		flushSync();

		expect(onOpenChange).toHaveBeenLastCalledWith({ open: false });
		expect(trigger.getAttribute('data-state')).toBe('closed');

		await settle();
		flushSync();
		expect(contentOf()).toBeNull();
	});

	test('closes after the close delay when the pointer leaves the trigger', async () => {
		render(Harness, { openDelay: 0, closeDelay: 30 });

		const trigger = screen.getByRole('button', { name: '@sveltejs' });
		await fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
		await settle();
		flushSync();
		expect(contentOf()!.getAttribute('data-state')).toBe('open');

		await fireEvent.pointerLeave(trigger, { pointerType: 'mouse' });
		flushSync();
		expect(contentOf()!.getAttribute('data-state')).toBe('open');

		await settle();
		flushSync();
		expect(trigger.getAttribute('data-state')).toBe('closed');
	});

	test('opens on focus and closes on blur without a pointer', async () => {
		render(Harness, { openDelay: 0, closeDelay: 0 });

		const trigger = screen.getByRole('button', { name: '@sveltejs' });
		await fireEvent.focus(trigger);
		await settle();
		flushSync();
		expect(contentOf()!.getAttribute('data-state')).toBe('open');

		await fireEvent.blur(trigger);
		await settle();
		flushSync();
		expect(trigger.getAttribute('data-state')).toBe('closed');
	});

	test('closes on an outside pointerdown and ignores disabled', async () => {
		const { unmount } = render(Harness, { defaultOpen: true });
		flushSync();
		expect(contentOf()).toBeTruthy();

		await fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));
		flushSync();
		expect(contentOf()?.getAttribute('data-state')).toBe('closed');
		unmount();

		render(Harness, { openDelay: 0, disabled: true });
		flushSync();

		const trigger = screen.getByRole('button', { name: '@sveltejs' });
		await fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
		await settle();
		flushSync();

		expect(contentOf()).toBeNull();
		expect(trigger.getAttribute('data-state')).toBe('closed');
	});

	test('renders the body part, the requested placement and can stay unportalled', async () => {
		const portalled = render(Harness, {
			defaultOpen: true,
			withBody: true,
			positioning: { placement: 'right-start' }
		});
		flushSync();

		const content = contentOf()!;
		expect(content.getAttribute('data-placement')).toBe('right-start');
		expect(content.getAttribute('data-side')).toBe('right');

		const body = document.querySelector('[data-scope="hover-card"][data-part="body"]')!;
		expect(body.getAttribute('data-slot')).toBe('hover-card-body');
		expect(body.parentElement).toBe(content);
		portalled.unmount();

		const local = render(Harness, { defaultOpen: true, portalled: false });
		flushSync();

		expect(local.container.contains(contentOf())).toBe(true);
		expect(document.querySelector('[data-rta-portal]')).toBeNull();
	});
});
