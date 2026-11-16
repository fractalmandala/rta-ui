import { expect, test, vi } from 'vitest';
import { mergeProps } from '../../src/lib/internal/mergeProps';

test('later props win for plain values, earlier ones fill gaps', () => {
  expect(mergeProps({ a: 1, b: 2 }, { b: 3, c: 4 })).toEqual({ a: 1, b: 3, c: 4 });
  expect(mergeProps({ a: undefined }, { a: 'filled' })).toEqual({ a: 'filled' });
});

test('class and style merge instead of replacing', () => {
  const merged = mergeProps({ class: 'a', style: 'color:red' }, { class: 'b', style: 'top:0' });
  expect(merged.class).toBe('a b');
  expect(merged.style).toBe('color: red; top: 0');
});

test('the later style declaration wins for the same property', () => {
  const merged = mergeProps({ style: 'color:red' }, { style: 'color:blue' });
  expect(merged.style).toBe('color: blue');
});

// Ark's contract: the later source's handler runs first, then the earlier one.
test('event handlers chain later-first', () => {
  const calls: string[] = [];
  const merged = mergeProps(
    { onclick: () => calls.push('first') },
    { onclick: () => calls.push('second') },
  );

  merged.onclick?.(new MouseEvent('click'));

  expect(calls).toEqual(['second', 'first']);
});

test('data-ownedby collects both sides', () => {
  expect(
    mergeProps({ 'data-ownedby': 'a b' }, { 'data-ownedby': 'b c' })['data-ownedby'],
  ).toBe('a b c');
});

test('symbol keys are copied whole so attachments survive', () => {
  const attachment = Symbol('attachment');
  const merged = mergeProps({ [attachment]: 'kept' }, { other: true });
  expect(merged[attachment]).toBe('kept');
});

test('skips undefined sources', () => {
  expect(mergeProps({ a: 1 }, undefined, null, { b: 2 })).toEqual({ a: 1, b: 2 });
});

test('a handler paired with an explicit undefined is dropped, not called', () => {
  const spy = vi.fn();
  const merged = mergeProps({ onclick: spy }, { onclick: undefined });
  merged.onclick?.(new MouseEvent('click'));
  expect(spy).toHaveBeenCalledTimes(1);
});
