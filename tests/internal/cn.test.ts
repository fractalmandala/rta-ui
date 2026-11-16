import { expect, test } from 'vitest';
import { cn } from '../../src/lib/internal/cn';

test('joins the value shapes a class prop can carry', () => {
  expect(cn('a', 'b')).toBe('a b');
  expect(cn('a', undefined, null, false, 0, '')).toBe('a');
  expect(cn(['a', ['b', { c: true, d: false }]], { e: 1, f: 0 })).toBe('a b c e');
  expect(cn(1, 'x')).toBe('1 x');
  expect(cn()).toBe('');
});
