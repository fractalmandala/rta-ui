import axe from 'axe-core';
import { expect, test } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import Docs from '../src/routes/+page.svelte';

// jsdom has no layout, so rules that depend on geometry cannot be judged here.
const OPTIONS: axe.RunOptions = {
  rules: {
    'color-contrast': { enabled: false },
    'landmark-one-main': { enabled: false },
    region: { enabled: false },
  },
};

const violations = async () => {
  const results = await axe.run(document.body, OPTIONS);
  return results.violations.map((violation) => `${violation.id}: ${violation.nodes.length} node(s)`);
};

test('every gallery group is free of accessibility violations', async () => {
  render(Docs, {});

  const groups = ['Actions', 'Typography', 'Layout', 'Content', 'Forms', 'Feedback', 'Navigation'];
  const found: Record<string, string[]> = {};

  for (const group of groups) {
    await fireEvent.click(screen.getByRole('button', { name: group }));
    const report = await violations();
    if (report.length) found[group] = report;
  }

  expect(found).toEqual({});
});
