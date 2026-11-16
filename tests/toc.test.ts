import { fireEvent, render } from '@testing-library/svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { tick } from 'svelte';
import Phase6Toc from './harness/Phase6Toc.svelte';
import Phase6TocRoot from './harness/Phase6TocRoot.svelte';

type TocHarness = {
	setActiveIds(value: string[]): void;
	getActiveIds(): string[];
	getIndicatorRect(): { x: number; y: number; width: number; height: number } | null;
};

function harness(component: unknown): TocHarness {
	return component as TocHarness;
}

function part(name: string): HTMLElement {
	return document.querySelector(`[data-scope="toc"][data-part="${name}"]`) as HTMLElement;
}

function parts(name: string): HTMLElement[] {
	return Array.from(
		document.querySelectorAll(`[data-scope="toc"][data-part="${name}"]`)
	) as HTMLElement[];
}

function mockRect(el: Element, rect: { top: number; left: number; width: number; height: number }) {
	const value = {
		x: rect.left,
		y: rect.top,
		top: rect.top,
		left: rect.left,
		width: rect.width,
		height: rect.height,
		right: rect.left + rect.width,
		bottom: rect.top + rect.height,
		toJSON: () => value
	};
	Object.defineProperty(el, 'getBoundingClientRect', {
		configurable: true,
		value: () => value
	});
}

class FakeIntersectionObserver {
	static instances: FakeIntersectionObserver[] = [];
	callback: (entries: IntersectionObserverEntry[]) => void;
	options: IntersectionObserverInit | undefined;
	targets: Element[] = [];

	constructor(
		callback: (entries: IntersectionObserverEntry[]) => void,
		options?: IntersectionObserverInit
	) {
		this.callback = callback;
		this.options = options;
		FakeIntersectionObserver.instances.push(this);
	}

	observe(target: Element) {
		this.targets.push(target);
	}

	unobserve() {}

	disconnect() {}

	takeRecords() {
		return [];
	}

	trigger(entries: Partial<IntersectionObserverEntry>[]) {
		this.callback(entries as IntersectionObserverEntry[]);
	}
}

afterEach(() => {
	vi.unstubAllGlobals();
	delete (window as unknown as Record<string, unknown>).IntersectionObserver;
});

describe('Toc', () => {
	test('renders the Ark anatomy, ids and attributes', () => {
		render(Phase6Toc, { props: {} });

		const root = part('root');
		expect(root.getAttribute('data-scope')).toBe('toc');
		expect(root.getAttribute('data-part')).toBe('root');
		expect(root.getAttribute('data-slot')).toBe('toc-root-provider');
		expect(root.id.startsWith('toc:')).toBe(true);

		const nav = part('nav');
		const title = part('title');
		const list = part('list');
		expect(nav.tagName).toBe('NAV');
		expect(nav.getAttribute('data-slot')).toBe('toc-nav');
		expect(nav.id).not.toBe(root.id);
		expect(nav.getAttribute('aria-labelledby')).toBe(title.id);
		expect(title.id.endsWith(':title')).toBe(true);
		expect(list.id.endsWith(':list')).toBe(true);

		const indicator = part('indicator');
		expect(indicator.id.endsWith(':indicator')).toBe(true);
		expect(indicator.style.position).toBe('absolute');
		expect(indicator.hasAttribute('hidden')).toBe(true);

		const items = parts('item');
		expect(items).toHaveLength(3);
		expect(items[0].getAttribute('data-value')).toBe('introduction');
		expect(items[0].getAttribute('data-depth')).toBe('2');
		expect(items[1].getAttribute('data-depth')).toBe('3');
		expect(items[0].style.getPropertyValue('--depth')).toBe('2');
		expect(items[0].id.endsWith(':item-introduction')).toBe(true);

		const links = parts('link');
		expect(links[0].tagName).toBe('A');
		expect(links[0].id.endsWith(':link-introduction')).toBe(true);
		expect(links[0].getAttribute('href')).toBe('#introduction');
		expect(links[0].hasAttribute('aria-current')).toBe(false);

		expect(document.querySelector('[data-slot="toc-content"]')?.tagName).toBe('ARTICLE');
	});

	test('renders the shorthand root and the rail hierarchy', () => {
		render(Phase6TocRoot, { props: {} });

		const root = part('root');
		expect(root.getAttribute('data-slot')).toBe('toc-root');
		expect(root.id.startsWith('toc:')).toBe(true);

		const links = parts('link');
		expect(links[1].getAttribute('aria-current')).toBe('location');

		const rails = document.querySelectorAll('[data-slot="toc-rail"]');
		expect(rails).toHaveLength(3);
		for (const rail of Array.from(rails)) {
			expect(rail.getAttribute('aria-hidden')).toBe('true');
		}

		const nested = rails[1] as SVGSVGElement;
		expect(nested.style.width).toBe('26px');
		expect(nested.style.getPropertyValue('height')).toBe(
			'calc(100% + 0px + var(--moduix-spacing-0-5))'
		);
		expect(nested.querySelector('path')?.getAttribute('d')).toBe(
			'M 0.5 0 C 0.5 8 12.5 4 12.5 12'
		);
		expect(nested.querySelector('line')?.getAttribute('y1')).toBe('12');

		const intro = rails[0] as SVGSVGElement;
		expect(intro.style.width).toBe('14px');
		expect(intro.querySelector('path')).toBeNull();
		expect(intro.querySelector('line')?.getAttribute('y1')).toBe('6');
	});

	test('marks the active item, link and range hooks', () => {
		render(Phase6Toc, { props: { defaultActiveIds: ['configuration'] } });

		const [introduction, configuration] = parts('item');
		expect(configuration.hasAttribute('data-active')).toBe(true);
		expect(configuration.hasAttribute('data-first')).toBe(true);
		expect(configuration.hasAttribute('data-last')).toBe(true);
		expect(introduction.hasAttribute('data-active')).toBe(false);
		expect(introduction.hasAttribute('data-first')).toBe(false);

		const links = parts('link');
		expect(links[1].getAttribute('aria-current')).toBe('location');
		expect(links[1].hasAttribute('data-active')).toBe(true);
		expect(links[0].hasAttribute('aria-current')).toBe(false);

		// jsdom reports an empty rect for every element, so the indicator stays hidden.
		expect(part('indicator').hasAttribute('hidden')).toBe(true);
	});

	test('setActiveIds keeps the state, hooks and callback in sync', async () => {
		const onActiveChange = vi.fn();
		const { component, unmount } = render(Phase6Toc, {
			props: { defaultActiveIds: ['introduction'], onActiveChange }
		});
		const toc = harness(component);

		expect(toc.getActiveIds()).toEqual(['introduction']);

		toc.setActiveIds(['usage']);
		await tick();

		expect(toc.getActiveIds()).toEqual(['usage']);
		expect(parts('link')[2].getAttribute('aria-current')).toBe('location');
		expect(parts('link')[0].hasAttribute('aria-current')).toBe(false);
		expect(parts('item')[2].hasAttribute('data-active')).toBe(true);
		expect(parts('item')[0].hasAttribute('data-active')).toBe(false);
		expect(onActiveChange).toHaveBeenCalledTimes(1);
		expect(onActiveChange).toHaveBeenCalledWith({
			activeIds: ['usage'],
			activeItems: [{ value: 'usage', depth: 2, label: 'Usage' }]
		});

		unmount();

		const controlled = harness(
			render(Phase6Toc, { props: { activeIds: ['introduction'], onActiveChange } }).component
		);
		controlled.setActiveIds(['configuration']);
		await tick();

		// Controlled: the requested ids are reported, the owner keeps the rendered state.
		expect(onActiveChange).toHaveBeenLastCalledWith({
			activeIds: ['configuration'],
			activeItems: [{ value: 'configuration', depth: 3, label: 'Configuration' }]
		});
		expect(controlled.getActiveIds()).toEqual(['introduction']);
		expect(parts('link')[1].hasAttribute('aria-current')).toBe(false);
	});

	test('writes the indicator rect of the active range to the root', async () => {
		const { component } = render(Phase6Toc, {
			props: { defaultActiveIds: ['introduction', 'configuration'] }
		});
		const toc = harness(component);
		const items = parts('item');

		mockRect(part('list'), { top: 200, left: 100, width: 200, height: 120 });
		mockRect(items[0], { top: 230, left: 108, width: 120, height: 24 });
		mockRect(items[1], { top: 260, left: 108, width: 120, height: 24 });

		// Re-measure through the exposed setter, once the geometry is mocked.
		toc.setActiveIds(['configuration']);
		await tick();
		toc.setActiveIds(['introduction', 'configuration']);
		await tick();

		expect(toc.getIndicatorRect()).toEqual({ x: 8, y: 30, width: 120, height: 54 });

		const root = part('root');
		expect(root.style.getPropertyValue('--top')).toBe('30px');
		expect(root.style.getPropertyValue('--left')).toBe('8px');
		expect(root.style.getPropertyValue('--width')).toBe('120px');
		expect(root.style.getPropertyValue('--height')).toBe('54px');
		expect(part('indicator').hasAttribute('hidden')).toBe(false);
	});

	test('link clicks follow same-page hashes and skip other navigations', async () => {
		let pane: HTMLElement | null = null;
		const { component } = render(Phase6Toc, {
			props: { defaultActiveIds: ['introduction'], scrollEl: () => pane }
		});
		const toc = harness(component);
		pane = document.querySelector<HTMLElement>('[data-slot="toc-content"]');

		const heading = document.getElementById('usage') as HTMLElement;
		mockRect(pane as HTMLElement, { top: 0, left: 0, width: 400, height: 400 });
		mockRect(heading, { top: 300, left: 0, width: 400, height: 30 });
		Object.defineProperty(pane, 'scrollHeight', { configurable: true, value: 1000 });
		Object.defineProperty(pane, 'clientHeight', { configurable: true, value: 400 });

		const handled = await fireEvent.click(parts('link')[2]);
		await tick();

		expect(handled).toBe(false);
		expect((pane as HTMLElement).scrollTop).toBe(300);
		expect(window.location.hash).toBe('#usage');
		expect(toc.getActiveIds()).toEqual(['usage']);
		expect(parts('link')[2].getAttribute('aria-current')).toBe('location');

		// jsdom has no real navigation: block the default action of the clicks Toc must ignore.
		const stopNavigation = (event: Event) => event.preventDefault();
		document.addEventListener('click', stopNavigation);

		const crossPage = parts('link')[1];
		crossPage.setAttribute('href', '/elsewhere#configuration');
		fireEvent.click(crossPage);
		await tick();
		expect(toc.getActiveIds()).toEqual(['usage']);

		crossPage.setAttribute('href', '#configuration');
		fireEvent.click(crossPage, { button: 1 });
		await tick();
		expect(toc.getActiveIds()).toEqual(['usage']);

		document.removeEventListener('click', stopNavigation);
	});

	test('syncs active ids from an IntersectionObserver over the headings', async () => {
		vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
		(window as unknown as Record<string, unknown>).IntersectionObserver =
			FakeIntersectionObserver;

		const { component } = render(Phase6Toc, { props: { defaultActiveIds: [] } });
		const toc = harness(component);
		await tick();

		const observer = FakeIntersectionObserver.instances.at(-1);
		expect(observer).toBeTruthy();
		expect(observer?.options?.rootMargin).toBe('-20px 0% -40% 0%');
		expect(observer?.options?.threshold).toBe(0);
		expect(observer?.targets.map((target) => target.id)).toEqual([
			'introduction',
			'configuration',
			'usage'
		]);

		const heading = document.getElementById('configuration') as HTMLElement;
		observer?.trigger([{ target: heading, isIntersecting: true, rootBounds: { top: 0 } as DOMRectReadOnly }]);
		await tick();

		expect(toc.getActiveIds()).toEqual(['configuration']);
		expect(parts('link')[1].getAttribute('aria-current')).toBe('location');
		expect(parts('item')[1].hasAttribute('data-active')).toBe(true);
	});

	test('autoScroll reveals the active item inside the list container', async () => {
		const { component } = render(Phase6Toc, {
			props: { autoScroll: true, defaultActiveIds: ['introduction'] }
		});
		const toc = harness(component);

		const nav = part('nav');
		nav.style.overflowY = 'auto';
		Object.defineProperty(nav, 'scrollHeight', { configurable: true, value: 300 });
		Object.defineProperty(nav, 'clientHeight', { configurable: true, value: 100 });
		mockRect(nav, { top: 0, left: 0, width: 200, height: 100 });
		mockRect(parts('item')[2], { top: 250, left: 0, width: 200, height: 24 });

		toc.setActiveIds(['usage']);
		await tick();

		expect(nav.scrollTop).toBe(174);
	});
});
