import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import StepsBasic from './harness/StepsBasic.svelte';

const $ = <T extends Element = HTMLElement>(selector: string) =>
	document.querySelector(selector) as T | null;

describe('Steps', () => {
	test('renders the Ark contract', () => {
		render(StepsBasic, { props: { count: 3, step: 1 } });

		const root = $('[data-scope="steps"][data-part="root"]')!;
		expect(root.getAttribute('data-orientation')).toBe('horizontal');
		expect(root.getAttribute('style')).toBe('--percent: 33.33333333333333%;');
		expect(root.getAttribute('data-slot')).toBe('steps-root');

		const list = $('[data-part="list"]')!;
		expect(list.getAttribute('role')).toBe('tablist');
		expect(list.getAttribute('aria-orientation')).toBe('horizontal');
		expect(list.getAttribute('aria-owns')).toBe(
			`${root.id}:trigger:0 ${root.id}:trigger:1 ${root.id}:trigger:2`
		);

		const triggers = document.querySelectorAll('[data-part="trigger"]');
		expect(triggers).toHaveLength(3);
		expect(triggers[0].getAttribute('data-complete')).toBe('');
		expect(triggers[0].getAttribute('data-current')).toBeNull();
		expect(triggers[1].getAttribute('data-current')).toBe('');
		expect(triggers[1].getAttribute('data-state')).toBe('open');
		expect(triggers[1].getAttribute('aria-selected')).toBe('true');
		expect(triggers[1].getAttribute('aria-current')).toBe('step');
		expect(triggers[1].getAttribute('tabindex')).toBe('0');
		expect(triggers[2].getAttribute('data-incomplete')).toBe('');
		expect(triggers[2].getAttribute('tabindex')).toBe('0');
		expect(triggers[0].getAttribute('aria-controls')).toBe(`${root.id}:content:0`);

		const contents = document.querySelectorAll('[data-part="content"]');
		expect(contents).toHaveLength(4);
		expect(contents[1].hasAttribute('hidden')).toBe(false);
		expect(contents[0].hasAttribute('hidden')).toBe(true);
		expect(contents[1].getAttribute('aria-labelledby')).toBe(`${root.id}:trigger:1`);
		expect($('[data-slot="steps-completed-content"]')!.hasAttribute('hidden')).toBe(true);

		expect($('[data-part="indicator"]')!.getAttribute('aria-hidden')).toBe('true');
		expect(document.querySelectorAll('[data-part="separator"]')).toHaveLength(3);
		expect($('[data-part="progress"]')!.getAttribute('role')).toBe('progressbar');
		expect($('[data-part="progress"]')!.getAttribute('aria-valuetext')).toBe(
			'33.33333333333333% complete'
		);
	});

	test('next and prev triggers move through steps', async () => {
		const onStepChange = vi.fn();
		render(StepsBasic, { props: { count: 3, onStepChange, step: 0 } });

		expect($('[data-part="prev-trigger"]')!.hasAttribute('disabled')).toBe(true);
		await fireEvent.click($('[data-part="next-trigger"]')!);
		expect(onStepChange).toHaveBeenLastCalledWith({ step: 1 });

		await fireEvent.click($('[data-part="next-trigger"]')!);
		expect(onStepChange).toHaveBeenLastCalledWith({ step: 2 });

		await fireEvent.click($('[data-part="prev-trigger"]')!);
		expect(onStepChange).toHaveBeenLastCalledWith({ step: 1 });
	});

	test('non-linear triggers jump directly, linear triggers do not', async () => {
		const onStepChange = vi.fn();
		const { unmount } = render(StepsBasic, { props: { count: 3, onStepChange, step: 0 } });

		await fireEvent.click(document.querySelectorAll('[data-part="trigger"]')[2]);
		expect(onStepChange).toHaveBeenLastCalledWith({ step: 2 });
		unmount();

		onStepChange.mockClear();
		render(StepsBasic, { props: { count: 3, linear: true, onStepChange } });
		const triggers = document.querySelectorAll('[data-part="trigger"]');
		expect(triggers[0].getAttribute('tabindex')).toBe('0');
		expect(triggers[2].getAttribute('tabindex')).toBe('-1');
		await fireEvent.click(triggers[2]);
		expect(onStepChange).not.toHaveBeenCalled();
	});
});
