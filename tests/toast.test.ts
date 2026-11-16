import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import { describe, expect, test } from 'vitest';
import Phase4Toast from './harness/Phase4Toast.svelte';

const q = (selector: string) => document.querySelector<HTMLElement>(selector);
const qa = (selector: string) => [...document.querySelectorAll<HTMLElement>(selector)];
const viewport = () => q('[data-scope="toast"][data-part="group"]');
const roots = () => qa('[data-scope="toast"][data-part="root"]');
const root = () => roots()[0] ?? null;
const closeTrigger = () => q('[data-scope="toast"][data-part="close-trigger"]');
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const click = async (testId: string) => {
	await fireEvent.click(document.querySelector<HTMLElement>(`[data-testid="${testId}"]`)!);
	flushSync();
};

describe('Toast', () => {
	test('renders the group region contract before any toast exists', () => {
		render(Phase4Toast, {});

		const region = viewport()!;
		expect(region).toBeTruthy();
		expect(region.getAttribute('role')).toBe('region');
		expect(region.getAttribute('aria-live')).toBe('polite');
		expect(region.getAttribute('aria-relevant')).toBe('additions text');
		expect(region.getAttribute('aria-atomic')).toBe('false');
		expect(region.getAttribute('aria-label')).toBe('Notifications, bottom-end (alt+T)');
		expect(region.getAttribute('tabindex')).toBe('-1');
		expect(region.id).toBe('toast-group:bottom-end');
		expect(region.getAttribute('data-scope')).toBe('toast');
		expect(region.getAttribute('data-part')).toBe('group');
		expect(region.getAttribute('data-slot')).toBe('toast-toaster');
		expect(region.getAttribute('data-placement')).toBe('bottom-end');
		expect(region.getAttribute('data-side')).toBe('bottom');
		expect(region.getAttribute('data-align')).toBe('end');
		expect(region.style.position).toBe('fixed');
		expect(region.style.getPropertyValue('--gap')).toBe('16px');
		expect(region.style.getPropertyValue('--viewport-offset-left')).toBe('1rem');
		expect(region.style.insetInlineEnd).toBe('calc(env(safe-area-inset-right, 0px) + 1rem)');
		expect(roots()).toHaveLength(0);
	});

	test('wires ids, data hooks and the aria contract on a toast', async () => {
		render(Phase4Toast, {});
		await click('info');
		await waitFor(() => expect(root()).not.toBeNull());

		const toast = root()!;
		const title = q('[data-scope="toast"][data-part="title"]')!;
		const description = q('[data-scope="toast"][data-part="description"]')!;

		expect(toast.id).toBe('toast:' + toast.id.slice('toast:'.length));
		expect(title.id).toBe(`${toast.id}:title`);
		expect(description.id).toBe(`${toast.id}:description`);
		expect(toast.getAttribute('role')).toBe('status');
		expect(toast.getAttribute('aria-atomic')).toBe('true');
		expect(toast.getAttribute('aria-labelledby')).toBe(title.id);
		expect(toast.getAttribute('aria-describedby')).toBe(description.id);
		expect(toast.getAttribute('tabindex')).toBe('0');
		expect(toast.getAttribute('data-state')).toBe('open');
		expect(toast.getAttribute('data-type')).toBe('info');
		expect(toast.getAttribute('data-placement')).toBe('bottom-end');
		expect(toast.getAttribute('data-side')).toBe('bottom');
		expect(toast.getAttribute('data-align')).toBe('end');
		expect(toast.getAttribute('data-slot')).toBe('toast-root');
		expect(toast.getAttribute('data-front')).toBe('');
		expect(toast.hasAttribute('data-behind')).toBe(false);
		expect(toast.getAttribute('data-first')).toBe('');
		expect(toast.getAttribute('data-sibling')).toBeNull();
		expect(toast.getAttribute('data-overlap')).toBe('');
		expect(toast.hasAttribute('data-stack')).toBe(false);
		expect(title.getAttribute('data-slot')).toBe('toast-title');
		expect(description.getAttribute('data-slot')).toBe('toast-description');
		expect(toast.style.getPropertyValue('--remove-delay')).toBe('20ms');
		expect(toast.style.position).toBe('absolute');
		expect(q('[data-ghost="before"]')).not.toBeNull();
		expect(q('[data-ghost="after"]')).not.toBeNull();

		const close = closeTrigger()!;
		expect(close.id).toBe(`${toast.id}:close`);
		expect(close.getAttribute('type')).toBe('button');
		expect(close.getAttribute('aria-label')).toBe('Close toast');
		expect(close.getAttribute('data-slot')).toBe('toast-close-trigger');

		await waitFor(() => expect(root()!.getAttribute('data-mounted')).toBe(''));
		expect(root()!.getAttribute('data-mounted')).toBe('');
	});

	test('marks the front toast and expands the stack on pointer enter', async () => {
		render(Phase4Toast, { overlap: true });
		await click('info');
		await click('typed');
		await waitFor(() => expect(roots()).toHaveLength(2));

		const [front, behind] = roots();
		expect(front.getAttribute('data-type')).toBe('success');
		expect(front.getAttribute('data-front')).toBe('');
		expect(front.hasAttribute('data-behind')).toBe(false);
		expect(behind.getAttribute('data-type')).toBe('info');
		expect(behind.getAttribute('data-behind')).toBe('');
		expect(behind.hasAttribute('data-front')).toBe(false);
		expect(front.getAttribute('data-overlap')).toBe('');

		await fireEvent.mouseEnter(viewport()!);
		flushSync();

		expect(roots()[0].getAttribute('data-stack')).toBe('');
		expect(roots()[0].hasAttribute('data-overlap')).toBe(false);
		expect(roots()[0].getAttribute('data-paused')).toBe('');
	});

	test('closes through the close trigger: closing state then unmount', async () => {
		render(Phase4Toast, { onStatusChange: () => {} });
		await click('info');
		await waitFor(() => expect(root()).not.toBeNull());

		await fireEvent.click(closeTrigger()!);
		flushSync();

		expect(root()!.getAttribute('data-state')).toBe('closing');
		expect(root()!.style.pointerEvents).toBe('none');

		await waitFor(() => expect(root()).toBeNull(), { timeout: 1500 });
	});

	test('auto dismisses after the duration and pauses while hovered', async () => {
		render(Phase4Toast, { duration: 80 });
		await click('info');
		await waitFor(() => expect(root()).not.toBeNull());

		await fireEvent.mouseEnter(viewport()!);
		flushSync();
		await wait(120);

		expect(root()).not.toBeNull();
		expect(root()!.getAttribute('data-paused')).toBe('');

		await fireEvent.mouseLeave(viewport()!);
		flushSync();
		expect(root()!.hasAttribute('data-paused')).toBe(false);

		await waitFor(() => expect(root()).toBeNull(), { timeout: 1500 });
	});

	test('runs the action once and dismisses the toast', async () => {
		render(Phase4Toast, { action: true });
		await click('info');
		await waitFor(() => expect(root()).not.toBeNull());

		const action = q('[data-scope="toast"][data-part="action-trigger"]')!;
		expect(action.textContent?.trim()).toBe('Undo');
		expect(action.getAttribute('data-slot')).toBe('toast-action-trigger');

		await fireEvent.click(action);
		flushSync();

		expect(q('[data-testid="action-clicks"]')!.textContent).toBe('1');
		expect(root()!.getAttribute('data-state')).toBe('closing');
	});

	test('queues over the maximum and reveals the queued toast after removal', async () => {
		render(Phase4Toast, { max: 1 });
		await click('info');
		await click('typed');

		expect(roots()).toHaveLength(1);
		expect(roots()[0].getAttribute('data-type')).toBe('info');
		expect(q('[data-testid="count"]')!.textContent).toBe('1');

		await fireEvent.click(closeTrigger()!);
		flushSync();
		await waitFor(() => expect(roots().length).toBe(1), { timeout: 1500 });
		await waitFor(() => expect(roots()[0].getAttribute('data-type')).toBe('success'), { timeout: 1500 });
	});

	test('moves a promise toast from loading to success and updates in place', async () => {
		render(Phase4Toast, {});
		await click('promise');
		await waitFor(() => expect(root()).not.toBeNull());
		expect(root()!.getAttribute('data-type')).toBe('loading');
		expect(q('[data-scope="toast"][data-part="title"]')!.textContent?.trim()).toBe('Uploading');

		await click('resolve');
		await waitFor(() => expect(root()!.getAttribute('data-type')).toBe('success'), { timeout: 1500 });
		expect(q('[data-scope="toast"][data-part="title"]')!.textContent?.trim()).toBe('Uploaded');

		await click('update');
		await waitFor(() =>
			expect(q('[data-scope="toast"][data-part="title"]')!.textContent?.trim()).toBe('Updated in place')
		);
		expect(roots()).toHaveLength(1);
	});

	test('renders the icon and progress parts with live progress state', async () => {
		render(Phase4Toast, { custom: true, withIcon: true, withProgress: true, duration: 4000 });
		await click('info');
		await waitFor(() => expect(root()).not.toBeNull());

		const icon = q('[data-scope="toast"][data-part="icon"]')!;
		expect(icon.getAttribute('data-type')).toBe('info');
		expect(icon.getAttribute('data-slot')).toBe('toast-icon');
		expect(icon.getAttribute('aria-hidden')).toBe('true');

		const progress = q('[data-scope="toast"][data-part="progress"]')!;
		expect(progress.getAttribute('data-state')).toBe('open');
		expect(progress.getAttribute('data-slot')).toBe('toast-progress');
		const value = Number(progress.style.getPropertyValue('--progress'));
		expect(value).toBeGreaterThan(0);
		expect(value).toBeLessThanOrEqual(1);
		expect(q('[data-slot="toast-progress-bar"]')).not.toBeNull();
	});

	test('is RTL aware for the group placement style', async () => {
		const { unmount } = render(Phase4Toast, { dir: 'rtl', placement: 'bottom-end' });
		const region = viewport()!;
		expect(region.getAttribute('dir')).toBe('rtl');
		expect(region.style.insetInlineStart).toBe('calc(env(safe-area-inset-left, 0px) + 1rem)');
		expect(region.style.insetInlineEnd).toBe('');
		unmount();
	});
});
