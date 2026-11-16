import { expect, test } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import Input from '../src/lib/components/input/Input.svelte';
import Textarea from '../src/lib/components/textarea/Textarea.svelte';

test('an input carries the field hooks and the token size', () => {
  render(Input, { props: { size: 'sm', placeholder: 'Name' } });

  const input = screen.getByPlaceholderText('Name');
  expect(input.getAttribute('data-scope')).toBe('field');
  expect(input.getAttribute('data-part')).toBe('input');
  expect(input.getAttribute('data-size')).toBe('sm');
  expect(input.tagName).toBe('INPUT');
});

test('the native size attribute moves to htmlSize', () => {
  render(Input, { props: { htmlSize: 12 } });
  expect(screen.getByRole('textbox').getAttribute('size')).toBe('12');
});

test('typing writes the bound value back', async () => {
  let value = 'initial';
  render(Input, {
    props: {
      get value() {
        return value;
      },
      set value(next: string) {
        value = next;
      },
    },
  });

  const input = screen.getByRole('textbox') as HTMLInputElement;
  await fireEvent.input(input, { target: { value: 'typed' } });

  expect(value).toBe('typed');
  expect(input.value).toBe('typed');
});

test('a textarea keeps its own part and writes back its value', async () => {
  let value = 'first';
  render(Textarea, {
    props: {
      get value() {
        return value;
      },
      set value(next: string) {
        value = next;
      },
    },
  });

  const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
  expect(textarea.getAttribute('data-part')).toBe('textarea');

  await fireEvent.input(textarea, { target: { value: 'second' } });
  expect(value).toBe('second');
});
