import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import Harness from './harness/Phase4Tooltip.svelte';

const settle = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

const contentOf = () =>
	document.querySelector<HTMLElement>('[data-scope="tooltip"][data-part="content"]');

describe('tooltip', () => {
	test('renders the ark contract while closed', () => {
		render(Harness, {});

		const trigger = screen.getByRole('button', { name: 'Save' });
		expect(trigger.getAttribute('data-scope')).toBe('tooltip');
		expect(trigger.getAttribute('data-part')).toBe('trigger');
		expect(trigger.getAttribute('data-slot')).toBe('tooltip-trigger');
		expect(trigger.getAttribute('type')).toBe('button');
		expect(trigger.getAttribute('data-state')).toBe('closed');
		expect(trigger.hasAttribute('data-expanded')).toBe(false);
		expect(trigger.getAttribute('aria-describedby')).toBeNull();
		expect(trigger.id).toBe(`tooltip:${trigger.getAttribute('data-ownedby')}:trigger`);
		expect(contentOf()).toBeNull();
	});

	test('opens after the open delay on hover and links the content through aria-describedby', async () => {
		const onOpenChange = vi.fn();
		render(Harness, { openDelay: 20, onOpenChange });

		const trigger = screen.getByRole('button', { name: 'Save' });
		await fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
		flushSync();

		expect(contentOf()).toBeNull();
		expect(onOpenChange).not.toHaveBeenCalled();

		await settle();
		flushSync();

		expect(onOpenChange).toHaveBeenCalledWith({ open: true });
		expect(trigger.getAttribute('data-state')).toBe('open');
		expect(trigger.getAttribute('data-expanded')).toBe('');

		const content = contentOf()!;
		expect(trigger.getAttribute('aria-describedby')).toBe(content.id);
		expect(content.id).toBe(`tooltip:${trigger.getAttribute('data-ownedby')}:content`);
		expect(content.getAttribute('role')).toBe('tooltip');
		expect(content.getAttribute('data-state')).toBe('open');
		expect(content.getAttribute('data-placement')).toBe('bottom');
		expect(content.getAttribute('data-side')).toBe('bottom');
		expect(content.style.pointerEvents).toBe('none');
		expect(content.hasAttribute('hidden')).toBe(false);
		expect(content.closest('[data-rta-portal]')).toBeTruthy();
		expect(content.textContent).toContain('Saves your changes');

		const positioner = document.querySelector<HTMLElement>(
			'[data-scope="tooltip"][data-part="positioner"]'
		)!;
		expect(positioner.id).toBe(`tooltip:${trigger.getAttribute('data-ownedby')}:popper`);
		expect(positioner.style.position).toBe('absolute');
		expect(positioner.style.isolation).toBe('isolate');
		expect(content.parentElement).toBe(positioner);

		const arrow = document.querySelector<HTMLElement>('[data-scope="tooltip"][data-part="arrow"]')!;
		expect(arrow.getAttribute('data-slot')).toBe('tooltip-arrow');
		expect(arrow.querySelector('[data-slot="tooltip-arrow-tip"]')).toBeTruthy();
	});

	test('closes after the close delay when the pointer leaves', async () => {
		const onOpenChange = vi.fn();
		render(Harness, { openDelay: 0, closeDelay: 20, onOpenChange });

		const trigger = screen.getByRole('button', { name: 'Save' });
		await fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
		await settle();
		flushSync();
		expect(contentOf()!.getAttribute('data-state')).toBe('open');

		await fireEvent.pointerLeave(trigger, { pointerType: 'mouse' });
		flushSync();
		expect(contentOf()!.getAttribute('data-state')).toBe('open');
		expect(onOpenChange).toHaveBeenCalledTimes(1);

		await settle();
		flushSync();

		expect(onOpenChange).toHaveBeenLastCalledWith({ open: false });
		expect(trigger.getAttribute('data-state')).toBe('closed');
		expect(contentOf()).toBeNull();
	});

	test('keeps an interactive tooltip open when the pointer moves onto the content', async () => {
		render(Harness, { openDelay: 0, closeDelay: 20, interactive: true });

		const trigger = screen.getByRole('button', { name: 'Save' });
		await fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
		await settle();
		flushSync();
		expect(contentOf()!.style.pointerEvents).toBe('auto');

		await fireEvent.pointerLeave(trigger, { pointerType: 'mouse' });
		await fireEvent.pointerEnter(contentOf()!, { pointerType: 'mouse' });
		await settle();
		flushSync();

		expect(contentOf()!.getAttribute('data-state')).toBe('open');
		expect(screen.getByRole('tooltip')).toBeTruthy();
	});

	test('closes on Escape and on pointerdown, and cleans up aria-describedby', async () => {
		render(Harness, { openDelay: 0, closeDelay: 0 });

		const trigger = screen.getByRole('button', { name: 'Save' });
		await fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
		await settle();
		flushSync();
		expect(trigger.getAttribute('aria-describedby')).toBeTruthy();

		await fireEvent.keyDown(document.body, { key: 'Escape' });
		await settle();
		flushSync();
		expect(trigger.getAttribute('data-state')).toBe('closed');
		expect(trigger.getAttribute('aria-describedby')).toBeNull();

		await fireEvent.pointerLeave(trigger, { pointerType: 'mouse' });
		await fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
		await settle();
		flushSync();
		expect(trigger.getAttribute('data-state')).toBe('open');

		await fireEvent.pointerDown(trigger, { button: 0, pointerType: 'mouse' });
		await settle();
		flushSync();
		expect(trigger.getAttribute('data-state')).toBe('closed');
	});

	test('follows the active trigger value while open', async () => {
		render(Harness, { twoTriggers: true, openDelay: 0, closeDelay: 0 });

		const save = screen.getByRole('button', { name: 'Save' });
		const publish = screen.getByRole('button', { name: 'Publish' });
		expect(save.id).toBe(`tooltip:${save.getAttribute('data-ownedby')}:trigger:save`);
		expect(publish.id).toBe(`tooltip:${publish.getAttribute('data-ownedby')}:trigger:publish`);

		await fireEvent.pointerEnter(save, { pointerType: 'mouse' });
		await settle();
		flushSync();

		expect(contentOf()).toBeTruthy();
		expect(save.getAttribute('data-current')).toBe('');
		expect(publish.hasAttribute('data-current')).toBe(false);

		await fireEvent.pointerMove(publish, { pointerType: 'mouse' });
		await settle(20);
		flushSync();

		expect(contentOf()!.getAttribute('data-state')).toBe('open');
		expect(publish.getAttribute('data-value')).toBe('publish');
		expect(publish.getAttribute('data-current')).toBe('');
		expect(save.hasAttribute('data-current')).toBe(false);
	});

	test('renders the composed body and the disabled trigger wrapper', async () => {
		const { unmount } = render(Harness, { body: true, defaultOpen: true, positioning: { placement: 'top' } });
		flushSync();

		expect(contentOf()!.getAttribute('data-placement')).toBe('top');

		const arrow = document.querySelector('[data-scope="tooltip"][data-part="arrow"]')!;
		expect(arrow.parentElement).toBe(contentOf());
		unmount();

		render(Harness, { disabledTrigger: true });
		flushSync();

		const wrapper = document.querySelector('[data-slot="tooltip-disabled-trigger"]')!;
		expect(wrapper.tagName).toBe('SPAN');
		expect(wrapper.getAttribute('tabindex')).toBe('0');
		expect(wrapper.getAttribute('data-part')).toBe('trigger');
		expect(wrapper.getAttribute('data-ownedby')).toBeTruthy();
	});
});
