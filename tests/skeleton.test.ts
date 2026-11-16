import { expect, test } from 'vitest';
import { render } from '@testing-library/svelte';
import Skeleton from '../src/lib/components/skeleton/Skeleton.svelte';

test('is a loading pulse hidden from assistive tech by default', () => {
  render(Skeleton, {});

  const skeleton = document.querySelector('[data-slot="skeleton-root"]')!;
  expect(skeleton.getAttribute('data-state')).toBe('loading');
  expect(skeleton.getAttribute('data-variant')).toBe('pulse');
  expect(skeleton.getAttribute('aria-hidden')).toBe('true');
  expect(skeleton.hasAttribute('data-loading')).toBe(true);
});

test('loaded skeletons expose no hidden or loading hooks', () => {
  render(Skeleton, { props: { loading: false } });

  const skeleton = document.querySelector('[data-slot="skeleton-root"]')!;
  expect(skeleton.getAttribute('data-state')).toBe('loaded');
  expect(skeleton.hasAttribute('aria-hidden')).toBe(false);
  expect(skeleton.hasAttribute('data-loading')).toBe(false);
});

test('turns numeric dimensions into pixel styles', () => {
  render(Skeleton, { props: { width: 120, height: '2rem', borderRadius: 8 } });

  const style = document.querySelector<HTMLElement>('[data-slot="skeleton-root"]')!.style;
  expect(style.width).toBe('120px');
  expect(style.height).toBe('2rem');
  expect(style.borderRadius).toBe('8px');
});
