import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import { tick } from 'svelte';
import Phase4Dialog from './harness/Phase4Dialog.svelte';

const $ = (selector: string) => document.querySelector(selector) as HTMLElement | null;
const $$ = (selector: string) => [...document.querySelectorAll(selector)] as HTMLElement[];

async function openDialog(props: Record<string, unknown> = {}) {
	const result = render(Phase4Dialog, { props });
	await fireEvent.click($$('[data-part="trigger"]').at(-1)!);
	await tick();
	return result;
}

describe('Dialog', () => {
	test('applies ids and data hooks from the Zag contract', async () => {
		render(Phase4Dialog, { props: {} });

		const trigger = $('[data-scope="dialog"][data-part="trigger"]')!;
		const contentId = '[data-scope="dialog"][data-part="content"]';
		expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
		expect(trigger.getAttribute('aria-expanded')).toBe('false');
		expect(trigger.getAttribute('data-state')).toBe('closed');
		// Lazy mount keeps the content out of the DOM, so aria-controls is skipped.
		expect(trigger.hasAttribute('aria-controls')).toBe(false);
		expect($(contentId)).toBeNull();

		await fireEvent.click(trigger);
		await tick();

		expect(trigger.getAttribute('aria-expanded')).toBe('true');
		expect(trigger.getAttribute('data-state')).toBe('open');
		const content = $(contentId)!;
		expect(trigger.getAttribute('aria-controls')).toBe(content.id);
		expect(content.getAttribute('role')).toBe('dialog');
		expect(content.getAttribute('aria-modal')).toBe('true');
		expect(content.getAttribute('tabindex')).toBe('-1');
		expect(content.getAttribute('data-state')).toBe('open');
		expect(content.getAttribute('data-slot')).toBe('dialog-content');

		const title = $('[data-part="title"]')!;
		expect(title.id).toBe(content.id.replace(':content', ':title'));
		expect(content.getAttribute('aria-labelledby')).toBe(title.id);

		const description = $('[data-part="description"]')!;
		expect(content.getAttribute('aria-describedby')).toBe(description.id);

		expect($('[data-part="positioner"]')!.id).toBe(content.id.replace(':content', ':positioner'));
		expect($('[data-part="backdrop"]')!.getAttribute('data-state')).toBe('open');
		expect($('[data-part="backdrop"]')!.getAttribute('data-scope')).toBe('dialog');
	});

	test('closes on escape, restores focus to the trigger and unmounts', async () => {
		render(Phase4Dialog, { props: {} });
		const trigger = $('[data-part="trigger"]')!;
		trigger.focus();
		await fireEvent.click(trigger);
		await tick();

		expect($('[data-part="content"]')).not.toBeNull();
		await fireEvent.keyDown(document.body, { key: 'Escape' });
		await tick();

		await waitFor(() => expect($('[data-part="content"]')).toBeNull());
		expect(trigger.getAttribute('aria-expanded')).toBe('false');
		expect(document.activeElement).toBe(trigger);
	});

	test('closes on an outside pointer that starts and ends on the backdrop', async () => {
		const onOpenChange = vi.fn();
		render(Phase4Dialog, { props: { onOpenChange } });
		await fireEvent.click($('[data-part="trigger"]')!);
		await tick();

		const backdrop = $('[data-part="backdrop"]')!;
		// A press that starts on the content and releases on the backdrop must not dismiss.
		await fireEvent.pointerDown($('[data-part="content"]')!);
		await fireEvent.pointerUp(backdrop);
		await tick();
		expect($('[data-part="content"]')).not.toBeNull();
		expect(onOpenChange).not.toHaveBeenCalledWith({ open: false });

		await fireEvent.pointerDown(backdrop);
		await fireEvent.pointerUp(backdrop);
		await tick();

		expect(onOpenChange).toHaveBeenLastCalledWith({ open: false });
		await waitFor(() => expect($('[data-part="content"]')).toBeNull());
	});

	test('a non-modal dialog keeps pointer events and skips aria-modal', async () => {
		await openDialog({ modal: false });

		const content = $('[data-part="content"]')!;
		expect(content.getAttribute('aria-modal')).toBe('false');
		expect(content.style.pointerEvents).toBe('auto');
		expect($('[data-part="positioner"]')!.style.pointerEvents).toBe('none');
		expect(document.body.style.overflow).not.toBe('hidden');
	});

	test('a modal dialog locks scroll and hides the page from assistive tech', async () => {
		await openDialog();

		expect(document.body.style.overflow).toBe('hidden');
		expect(document.querySelector('[data-rta-portal]')?.parentElement).toBe(document.body);

		const page = [...document.body.children].find((node) => !node.hasAttribute('data-rta-portal'));
		expect(page?.getAttribute('aria-hidden')).toBe('true');
	});

	test('title and description are only advertised when their parts render', async () => {
		await openDialog({ showTitle: false, showDescription: false });

		const content = $('[data-part="content"]')!;
		expect(content.hasAttribute('aria-labelledby')).toBe(false);
		expect(content.hasAttribute('aria-describedby')).toBe(false);

		await openDialog({ ariaLabel: 'Settings' });
		const labelled = $$('[data-part="content"]').at(-1)!;
		expect(labelled.getAttribute('aria-label')).toBe('Settings');
		expect(labelled.hasAttribute('aria-labelledby')).toBe(false);
	});

	test('portalled={false} renders the overlay in place', async () => {
		const { container } = await openDialog({ portalled: false });

		const panel = $('[data-part="content"]')!;
		expect(panel.closest('[data-rta-portal]')).toBeNull();
		expect(container.contains(panel)).toBe(true);
		expect(container.contains($('[data-part="backdrop"]'))).toBe(true);
		expect(container.contains($('[data-part="positioner"]'))).toBe(true);
	});

	test('lazyMount={false} keeps a closed dialog mounted but hidden', () => {
		render(Phase4Dialog, { props: { lazyMount: false } });

		const panel = $('[data-part="content"]')!;
		expect(panel.hidden).toBe(true);
		expect(panel.getAttribute('data-state')).toBe('closed');
		expect($('[data-part="trigger"]')!.getAttribute('aria-controls')).toBe(panel.id);
	});

	test('the close icon and close trigger both dismiss, and unmountOnExit=false stays mounted', async () => {
		const onOpenChange = vi.fn();
		render(Phase4Dialog, { props: { onOpenChange, unmountOnExit: false } });
		await fireEvent.click($('[data-part="trigger"]')!);
		await tick();

		const closeIcon = $('[data-slot="dialog-close-icon"]')!;
		expect(closeIcon.getAttribute('aria-label')).toBe('Close dialog');
		expect(closeIcon.getAttribute('data-part')).toBe('close-trigger');
		expect(closeIcon.getAttribute('data-scope')).toBe('dialog');
		expect(closeIcon.className).toContain('closeIcon');

		await fireEvent.click(closeIcon);
		await tick();
		expect(onOpenChange).toHaveBeenLastCalledWith({ open: false });

		const content = $('[data-part="content"]') as HTMLElement;
		expect(content).not.toBeNull();
		await waitFor(() => expect(content.getAttribute('data-state')).toBe('closed'));
		await waitFor(() => expect(content.hidden).toBe(true));
	});
});
