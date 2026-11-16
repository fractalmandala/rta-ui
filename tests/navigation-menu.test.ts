import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import Harness from './harness/Phase4NavigationMenu.svelte';

// jsdom reports no layout; the viewport maths needs a stable box to measure.
const rect = { x: 0, y: 0, left: 0, top: 0, right: 100, bottom: 40, width: 100, height: 40 };
Object.defineProperties(HTMLElement.prototype, {
	offsetWidth: { configurable: true, get: () => 180 },
	offsetHeight: { configurable: true, get: () => 120 },
	offsetLeft: { configurable: true, get: () => 0 },
	offsetTop: { configurable: true, get: () => 0 }
});
HTMLElement.prototype.getBoundingClientRect = () => ({ ...rect, toJSON: () => rect }) as DOMRect;

const settle = () => new Promise((resolve) => setTimeout(resolve, 60));

const part = <T extends HTMLElement = HTMLElement>(name: string) =>
	document.querySelector<T & HTMLElement>(`[data-scope="navigation-menu"][data-part="${name}"]`);

const triggerOf = (label: string) => screen.getByRole('button', { name: label }) as HTMLElement;

const hover = (element: HTMLElement, forward = true) => {
	element.dispatchEvent(
		new PointerEvent(forward ? 'pointerenter' : 'pointerleave', {
			bubbles: false,
			pointerType: 'mouse'
		})
	);
	flushSync();
};

const menuId = () => part('root')!.id.replace(/^nav-menu:(.+)$/, '$1');

describe('navigation-menu', () => {
	test('renders the ark contract while closed', () => {
		render(Harness, {});

		const root = part('root')!;
		const id = menuId();
		expect(root.getAttribute('data-slot')).toBe('navigation-menu-root');
		expect(root.getAttribute('data-orientation')).toBe('horizontal');
		expect(root.getAttribute('aria-label')).toBe('Main');
		expect(root.id).toBe(`nav-menu:${id}`);

		const list = part('list')!;
		expect(list.id).toBe(`nav-menu:${id}:list`);
		expect(list.getAttribute('data-orientation')).toBe('horizontal');
		expect(list.getAttribute('style')).toContain('position: relative');

		const products = triggerOf('Products');
		expect(products.getAttribute('data-slot')).toBe('navigation-menu-trigger');
		expect(products.getAttribute('type')).toBe('button');
		expect(products.getAttribute('data-uid')).toBe(id);
		expect(products.getAttribute('data-value')).toBe('products');
		expect(products.getAttribute('data-state')).toBe('closed');
		expect(products.id).toBe(`nav-menu:${id}:trigger:products`);
		expect(products.getAttribute('aria-controls')).toBe(`nav-menu:${id}:content:products`);
		expect(products.getAttribute('aria-expanded')).toBe('false');
		expect(products.getAttribute('data-trigger-proxy-id')).toBe(
			`nav-menu:${id}:trigger-proxy:products`
		);

		const item = part('item')!;
		expect(item.id).toBe(`nav-menu:${id}:item:products`);
		expect(item.getAttribute('data-value')).toBe('products');
		expect(item.getAttribute('data-state')).toBe('closed');

		const content = part('content')!;
		expect(content.id).toBe(`nav-menu:${id}:content:products`);
		expect(content.getAttribute('aria-labelledby')).toBe(`nav-menu:${id}:trigger:products`);
		expect(content.getAttribute('data-state')).toBe('closed');
		expect(content.hasAttribute('hidden')).toBe(true);

		const viewport = part('viewport')!;
		expect(viewport.id).toBe(`nav-menu:${id}:viewport`);
		expect(viewport.getAttribute('data-state')).toBe('closed');
		expect(viewport.hasAttribute('hidden')).toBe(true);
		expect(part('viewport-positioner')!.getAttribute('data-orientation')).toBe('horizontal');
		expect(part('indicator')!.hasAttribute('hidden')).toBe(true);
		expect(part('item-indicator')!.hasAttribute('hidden')).toBe(true);
		expect(part('arrow')!.getAttribute('aria-hidden')).toBe('true');

		const docs = triggerOf('Docs');
		expect(docs.hasAttribute('disabled')).toBe(true);
		expect(docs.getAttribute('data-disabled')).toBe('');
	});

	test('opens on hover after openDelay and closes after closeDelay', async () => {
		const onValueChange = vi.fn();
		render(Harness, { openDelay: 20, closeDelay: 20, onValueChange });

		const products = triggerOf('Products');
		hover(products);
		expect(onValueChange).not.toHaveBeenCalledWith({ value: 'products' });

		await settle();
		expect(onValueChange).toHaveBeenCalledWith({ value: 'products' });
		expect(products.getAttribute('data-state')).toBe('open');
		expect(products.getAttribute('aria-expanded')).toBe('true');

		hover(products, false);
		expect(products.getAttribute('data-state')).toBe('open');

		await settle();
		expect(onValueChange).toHaveBeenLastCalledWith({ value: '' });
		expect(products.getAttribute('data-state')).toBe('closed');
	});

	test('switches open item on click and toggles it closed', async () => {
		const onValueChange = vi.fn();
		render(Harness, { onValueChange });

		const products = triggerOf('Products');
		await fireEvent.click(products);
		flushSync();
		expect(onValueChange).toHaveBeenLastCalledWith({ value: 'products' });

		const company = triggerOf('Company');
		await fireEvent.click(company);
		flushSync();
		expect(onValueChange).toHaveBeenLastCalledWith({ value: 'company' });
		expect(products.getAttribute('data-state')).toBe('closed');
		expect(company.getAttribute('data-state')).toBe('open');
		expect(part('item')!.getAttribute('data-state')).toBe('closed');
		expect(document.querySelector('[data-part="item"][data-value="company"]')!.getAttribute('data-state')).toBe(
			'open'
		);

		await fireEvent.click(company);
		flushSync();
		expect(onValueChange).toHaveBeenLastCalledWith({ value: '' });
		expect(company.getAttribute('data-state')).toBe('closed');
	});

	test('moves between triggers with the arrow keys and into the content with ArrowDown', async () => {
		render(Harness, { defaultValue: 'products' });

		const products = triggerOf('Products');
		const company = triggerOf('Company');
		products.focus();

		await fireEvent.keyDown(products, { key: 'ArrowRight' });
		flushSync();
		expect(document.activeElement).toBe(company);

		await fireEvent.keyDown(company, { key: 'ArrowLeft' });
		flushSync();
		expect(document.activeElement).toBe(products);

		// Disabled items are skipped by the arrow and Home/End navigation.
		await fireEvent.keyDown(products, { key: 'End' });
		flushSync();
		expect(document.activeElement).toBe(company);

		await fireEvent.keyDown(company, { key: 'Home' });
		flushSync();
		expect(document.activeElement).toBe(products);

		await fireEvent.keyDown(products, { key: 'ArrowDown' });
		await settle();
		const link = screen.getByRole('link', { name: 'Analytics' });
		expect(document.activeElement).toBe(link);

		// Links walk with the menu's orientation: horizontal menus use the left/right arrows.
		await fireEvent.keyDown(link, { key: 'ArrowRight' });
		flushSync();
		expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Automation' }));

		await fireEvent.keyDown(screen.getByRole('link', { name: 'Automation' }), { key: 'ArrowLeft' });
		flushSync();
		expect(document.activeElement).toBe(link);
	});

	test('moves the open content into the measured viewport', async () => {
		render(Harness, { defaultValue: 'products', align: 'start' });
		await settle();

		const root = part('root')!;
		const viewport = part('viewport')!;
		const content = part('content')!;

		expect(content.closest('[data-part="viewport"]')).toBe(viewport);
		expect(viewport.contains(content)).toBe(true);
		expect(viewport.hasAttribute('hidden')).toBe(false);
		expect(viewport.getAttribute('data-state')).toBe('open');
		expect(viewport.getAttribute('data-align')).toBe('start');
		expect(content.hasAttribute('hidden')).toBe(false);
		expect(content.closest('[data-rta-portal]')).toBeTruthy();

		expect(viewport.style.getPropertyValue('--viewport-width').trim()).toBe('180px');
		expect(viewport.style.getPropertyValue('--viewport-height').trim()).toBe('120px');
		expect(viewport.style.getPropertyValue('--navigation-menu-viewport-width').trim()).toBe('180px');
		expect(viewport.style.getPropertyValue('--navigation-menu-viewport-height').trim()).toBe('120px');
		expect(root.style.getPropertyValue('--trigger-width').trim()).toBe('180px');
		// The viewport is clamped to the 10px screen offset.
		expect(root.style.getPropertyValue('--viewport-x').trim()).toBe('10px');
		expect(root.style.getPropertyValue('--viewport-y').trim()).toBe('10px');
		expect(part('indicator')!.hasAttribute('hidden')).toBe(false);
		expect(part('viewport-positioner')!.getAttribute('data-align')).toBe('start');
	});

	test('closes on Escape and on focus or pointer outside', async () => {
		const { unmount } = render(Harness, { defaultValue: 'products' });
		await settle();

		const products = triggerOf('Products');
		await fireEvent.keyDown(document.body, { key: 'Escape' });
		flushSync();
		expect(products.getAttribute('data-state')).toBe('closed');
		expect(part('content')!.getAttribute('data-state')).toBe('closed');
		unmount();

		render(Harness, { defaultValue: 'products', closeOnInteractOutside: false });
		await settle();
		await fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));
		flushSync();
		expect(triggerOf('Products').getAttribute('data-state')).toBe('open');
	});

	test('closes when focus leaves the menu for an outside control', async () => {
		render(Harness, { defaultValue: 'products' });
		await settle();

		const products = triggerOf('Products');
		const outside = screen.getByRole('button', { name: 'Outside' });
		outside.focus();
		await fireEvent.focusIn(outside);
		flushSync();
		expect(products.getAttribute('data-state')).toBe('closed');
	});

	test('closes on link activation and honours current, onSelect and closeOnClick', async () => {
		const { unmount } = render(Harness, { defaultValue: 'products', withLinkSelect: true });
		await settle();

		await fireEvent.click(triggerOf('Company'));
		flushSync();
		const about = screen.getByRole('link', { name: 'About' });
		expect(about.getAttribute('data-ownedby')).toBe(`nav-menu:${menuId()}:content:company`);
		expect(about.getAttribute('data-current')).toBe('');
		expect(about.getAttribute('aria-current')).toBe('page');

		await fireEvent.click(triggerOf('Products'));
		flushSync();
		const analytics = screen.getByRole('link', { name: 'Analytics' });
		expect(analytics.hasAttribute('data-current')).toBe(false);
		await fireEvent.click(analytics);
		flushSync();
		expect(triggerOf('Products').getAttribute('data-state')).toBe('closed');
		unmount();

		render(Harness, { defaultValue: 'products', keepOpenOnLink: true });
		await settle();
		await fireEvent.click(screen.getByRole('link', { name: 'Analytics' }));
		flushSync();
		expect(triggerOf('Products').getAttribute('data-state')).toBe('open');
	});
});
