import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import TabsBasic from './harness/TabsBasic.svelte';

function root() {
	return document.querySelector('[data-scope="tabs"][data-part="root"]') as HTMLElement;
}

function list() {
	return document.querySelector('[data-scope="tabs"][data-part="list"]') as HTMLElement;
}

function triggers() {
	return Array.from(
		document.querySelectorAll('[data-scope="tabs"][data-part="trigger"]')
	) as HTMLButtonElement[];
}

function contents() {
	return Array.from(
		document.querySelectorAll('[data-scope="tabs"][data-part="content"]')
	) as HTMLElement[];
}

describe('Tabs', () => {
	test('renders the ark contract', () => {
		render(TabsBasic, { props: { defaultValue: 'one' } });

		expect(root().getAttribute('data-orientation')).toBe('horizontal');
		expect(root().getAttribute('data-size')).toBe('sm');
		expect(root().getAttribute('data-variant')).toBe('line');
		expect(root().getAttribute('data-slot')).toBe('tabs-root');

		expect(list().getAttribute('role')).toBe('tablist');
		expect(list().getAttribute('aria-orientation')).toBe('horizontal');
		expect(list().getAttribute('aria-label')).toBe('Sections');

		const [one, two, three] = triggers();
		expect(one.getAttribute('role')).toBe('tab');
		expect(one.type).toBe('button');
		expect(one.getAttribute('aria-selected')).toBe('true');
		expect(one.getAttribute('data-selected')).toBe('');
		expect(one.tabIndex).toBe(0);
		expect(two.getAttribute('aria-selected')).toBe('false');
		expect(two.tabIndex).toBe(-1);
		expect(two.hasAttribute('data-selected')).toBe(false);
		expect(three.disabled).toBe(true);
		expect(three.getAttribute('data-disabled')).toBe('');

		const panels = contents();
		expect(panels[0].getAttribute('role')).toBe('tabpanel');
		expect(panels[0].getAttribute('aria-labelledby')).toBe(triggers()[0].id);
		expect(panels[0].hasAttribute('hidden')).toBe(false);
		expect(panels[1].hasAttribute('hidden')).toBe(true);
		expect(one.getAttribute('aria-controls')).toBe(panels[0].id);
		expect(two.hasAttribute('aria-controls')).toBe(false);
	});

	test('clicking a trigger selects it and reports the value', async () => {
		const onValueChange = vi.fn();
		render(TabsBasic, { props: { defaultValue: 'one', onValueChange } });

		await fireEvent.click(triggers()[1]);
		expect(onValueChange).toHaveBeenCalledWith({ value: 'two' });
		expect(triggers()[1].getAttribute('data-selected')).toBe('');
		expect(contents()[0].hasAttribute('hidden')).toBe(true);
		expect(contents()[1].hasAttribute('hidden')).toBe(false);
	});

	test('disabled triggers cannot be selected', async () => {
		const onValueChange = vi.fn();
		render(TabsBasic, { props: { defaultValue: 'one', onValueChange } });

		await fireEvent.click(triggers()[2]);
		expect(onValueChange).not.toHaveBeenCalled();
	});

	test('arrow keys move focus and auto-activate', async () => {
		const onValueChange = vi.fn();
		render(TabsBasic, { props: { defaultValue: 'one', onValueChange } });

		triggers()[0].focus();
		await fireEvent.keyDown(list(), { key: 'ArrowRight' });

		expect(document.activeElement).toBe(triggers()[1]);
		expect(triggers()[1].getAttribute('data-focus')).toBe('');
		expect(onValueChange).toHaveBeenCalledWith({ value: 'two' });
	});

	test('manual activation mode moves focus only', async () => {
		const onValueChange = vi.fn();
		render(TabsBasic, {
			props: { activationMode: 'manual', defaultValue: 'one', onValueChange }
		});

		triggers()[0].focus();
		await fireEvent.keyDown(list(), { key: 'ArrowRight' });

		expect(document.activeElement).toBe(triggers()[1]);
		expect(onValueChange).not.toHaveBeenCalled();
		expect(triggers()[0].getAttribute('data-selected')).toBe('');
	});

	test('vertical orientation ignores horizontal arrows', async () => {
		render(TabsBasic, { props: { defaultValue: 'one', orientation: 'vertical' } });

		expect(root().getAttribute('data-orientation')).toBe('vertical');
		triggers()[0].focus();
		await fireEvent.keyDown(list(), { key: 'ArrowRight' });
		expect(document.activeElement).toBe(triggers()[0]);

		await fireEvent.keyDown(list(), { key: 'ArrowDown' });
		expect(document.activeElement).toBe(triggers()[1]);
	});

	test('Home and End jump to the first and last enabled trigger', async () => {
		render(TabsBasic, { props: { defaultValue: 'two' } });

		triggers()[1].focus();
		await fireEvent.keyDown(list(), { key: 'End' });
		expect(document.activeElement).toBe(triggers()[1]);

		await fireEvent.keyDown(list(), { key: 'Home' });
		expect(document.activeElement).toBe(triggers()[0]);
	});
});
