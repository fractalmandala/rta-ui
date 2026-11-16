import { expect, test } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import Element from '../src/lib/internal/Element.svelte';
import ElementAsChild from './harness/ElementAsChild.svelte';

const text = createRawSnippet(() => ({ render: () => '<span data-testid="content">body</span>' }));

test('renders the requested tag with merged props', () => {
  render(Element, {
    props: {
      as: 'section',
      id: 'hero',
      class: 'one two',
      'data-slot': 'hero-root',
      children: text,
    },
  });

  const element = document.querySelector('[data-slot="hero-root"]')!;
  expect(element.tagName).toBe('SECTION');
  expect(element.id).toBe('hero');
  expect(element.className).toBe('one two');
  expect(element.textContent).toBe('body');
});

test('renders void HTML tags without children', () => {
  render(Element, { props: { as: 'img', src: '/a.png', alt: 'a' } });
  const image = document.querySelector('img')!;
  expect(image.getAttribute('src')).toBe('/a.png');
  expect(image.querySelector('span')).toBeNull();
});

test('renders void SVG tags in the SVG namespace', () => {
  render(Element, { props: { as: 'path', d: 'M0 0h10v10z' } });
  const path = document.querySelector('path')!;
  expect(path.namespaceURI).toBe('http://www.w3.org/2000/svg');
});

test('replaces the rendered element instead of wrapping it in asChild', () => {
  render(ElementAsChild, { props: { as: 'button' } });

  expect(document.querySelector('button')).toBeNull();
  const composed = document.querySelector('a')!;
  expect(composed.getAttribute('href')).toBe('#composed');
  expect(composed.getAttribute('data-slot')).toBe('button-root');
});

test('merges the composed child onto its own props in asChild', () => {
  render(ElementAsChild, { props: { as: 'button' } });

  const composed = document.querySelector('a')!;
  expect(composed.getAttribute('data-own')).toBe('yes');
  // The spread wins over the literal attribute, so the element's class is what lands.
  expect(composed.className).toBe('from-element');
});

test('runs the element handler alongside the composed child handler', () => {
  const calls: string[] = [];
  render(ElementAsChild, {
    props: {
      as: 'button',
      onclick: () => calls.push('element'),
      onchild: () => calls.push('child'),
    },
  });

  document.querySelector('a')!.click();

  expect(calls).toEqual(['child', 'element']);
});

test('attaches the ref of the rendered element', () => {
  let node: HTMLElement | null = null;
  render(Element, {
    props: {
      as: 'div',
      get ref() {
        return node;
      },
      set ref(value) {
        node = value;
      },
    },
  });

  expect(node).toBeInstanceOf(HTMLDivElement);
});
