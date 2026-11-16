import { render } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import StyleMerge from './harness/StyleMerge.svelte';

const $ = (selector: string) => document.querySelector(selector) as HTMLElement | null;

function styleOf(testId: string) {
	return $(`[data-testid="${testId}"]`)!.getAttribute('style') ?? '';
}

describe('consumer style merging', () => {
	test('keeps the generated declarations and appends consumer ones', () => {
		render(StyleMerge, { props: {} });

		const root = styleOf('progress-root');
		expect(root).toContain('--percent: 50');
		expect(root).toContain('height: 3px');
	});

	test('lets a consumer declaration win over the generated one', () => {
		render(StyleMerge, { props: {} });

		const range = styleOf('progress-range');
		expect(range).toContain('width: 12px');
		expect(range).not.toContain('width: 50%');

		const overlay = styleOf('qr-overlay');
		expect(overlay).toContain('position: absolute');
		expect(overlay).toContain('top: 50%');
		expect(overlay).toContain('translate: -50% -50%');
		expect(overlay).toContain('left: 0');
		expect(overlay).not.toContain('left: 50%');
	});
});
