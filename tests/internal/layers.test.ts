import { describe, expect, test, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import LayerHarness from '../harness/LayerHarness.svelte';
import { getTabbables } from '../../src/lib/internal/layers.svelte';

describe('escape layer', () => {
	test('the open layer owns Escape and can prevent it', async () => {
		const onEscape = vi.fn();
		render(LayerHarness, { props: { open: true, onEscape } });

		const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true, bubbles: true });
		document.dispatchEvent(event);

		expect(onEscape).toHaveBeenCalledTimes(1);
		expect(event.defaultPrevented).toBe(true);
	});

	test('a disabled layer ignores Escape', () => {
		const onEscape = vi.fn();
		render(LayerHarness, { props: { open: false, onEscape } });

		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

		expect(onEscape).not.toHaveBeenCalled();
	});

	test('only the topmost layer closes', () => {
		const lower = vi.fn();
		const upper = vi.fn();
		const first = render(LayerHarness, { props: { open: true, onEscape: lower } });
		const second = render(LayerHarness, { props: { open: true, onEscape: upper } });

		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true, bubbles: true }));

		expect(upper).toHaveBeenCalledTimes(1);
		expect(lower).not.toHaveBeenCalled();

		second.unmount();
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true, bubbles: true }));
		expect(lower).toHaveBeenCalledTimes(1);
		first.unmount();
	});
});

describe('dismissable layer', () => {
	test('a pointerdown outside fires the outside callbacks', async () => {
		const onPointerDownOutside = vi.fn();
		const onInteractOutside = vi.fn();
		render(LayerHarness, { props: { open: true, onPointerDownOutside, onInteractOutside } });

		const outside = document.createElement('button');
		document.body.appendChild(outside);
		outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));

		expect(onPointerDownOutside).toHaveBeenCalledTimes(1);
		expect(onInteractOutside).toHaveBeenCalledTimes(1);
		outside.remove();
	});

	test('a pointerdown inside the layer is ignored', () => {
		const onPointerDownOutside = vi.fn();
		const { container } = render(LayerHarness, { props: { open: true, onPointerDownOutside } });

		const inside = container.querySelector('[data-testid="layer"]')!;
		inside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));

		expect(onPointerDownOutside).not.toHaveBeenCalled();
	});

	test('focus outside fires the focus callback', () => {
		const onFocusOutside = vi.fn();
		render(LayerHarness, { props: { open: true, onFocusOutside } });

		const outside = document.createElement('input');
		document.body.appendChild(outside);
		outside.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

		expect(onFocusOutside).toHaveBeenCalledTimes(1);
		outside.remove();
	});

	test('a prevented outside event stops the interact callback', () => {
		const onInteractOutside = vi.fn();
		render(LayerHarness, {
			props: {
				open: true,
				onPointerDownOutside: (event: Event) => event.preventDefault(),
				onInteractOutside
			}
		});

		const outside = document.createElement('button');
		document.body.appendChild(outside);
		outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));

		expect(onInteractOutside).not.toHaveBeenCalled();
		outside.remove();
	});
});

describe('focus scope and scroll lock', () => {
	test('focus moves into the scope and returns on teardown', async () => {
		const before = document.createElement('button');
		document.body.appendChild(before);
		before.focus();

		const view = render(LayerHarness, { props: { open: true, trapFocus: true } });
		flushSync();

		const layer = view.container.querySelector('[data-testid="layer"]')!;
		expect(layer.contains(document.activeElement)).toBe(true);

		view.unmount();
		expect(document.activeElement).toBe(before);
		before.remove();
	});

	test('tab wraps from the last tabbable back to the first', () => {
		const view = render(LayerHarness, { props: { open: true, trapFocus: true } });
		flushSync();

		const tabbables = getTabbables(view.container.querySelector('[data-testid="layer"]')!);
		expect(tabbables.length).toBeGreaterThan(1);

		const last = tabbables[tabbables.length - 1];
		last.focus();
		const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
		document.dispatchEvent(event);
		flushSync();

		expect(event.defaultPrevented).toBe(true);
		expect(document.activeElement).toBe(tabbables[0]);
	});

	test('scroll lock hides body overflow while open and restores it after', () => {
		const view = render(LayerHarness, { props: { open: true, lockScroll: true } });
		flushSync();
		expect(document.body.style.overflow).toBe('hidden');

		view.unmount();
		expect(document.body.style.overflow).toBe('');
	});
});
