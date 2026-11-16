import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Image from '../src/lib/components/image/Image.svelte';
import ImageSource from '../src/lib/components/image/ImageSource.svelte';

test('is lazy and constrained by default', () => {
  render(Image, { props: { src: '/a.jpg', alt: 'A' } });

  const image = screen.getByAltText('A');
  expect(image.getAttribute('loading')).toBe('lazy');
  expect(image.getAttribute('data-layout')).toBe('constrained');
  expect(image.hasAttribute('fetchpriority')).toBe(false);
});

test('a priority image loads eagerly with a high fetch priority', () => {
  render(Image, { props: { src: '/hero.jpg', alt: 'Hero', priority: true } });

  const image = screen.getByAltText('Hero');
  expect(image.getAttribute('loading')).toBe('eager');
  expect(image.getAttribute('fetchpriority')).toBe('high');
});

test('explicit loading and fetchpriority win over priority', () => {
  render(Image, {
    props: { src: '/a.jpg', alt: 'A', priority: true, loading: 'lazy', fetchpriority: 'low' },
  });

  const image = screen.getByAltText('A');
  expect(image.getAttribute('loading')).toBe('lazy');
  expect(image.getAttribute('fetchpriority')).toBe('low');
});

test('renders a picture with its sources when a source child is given', () => {
  render(Image, { props: { src: '/a.jpg', alt: 'A', layout: 'fullWidth' } });

  expect(document.querySelector('img[data-layout="fullWidth"]')).not.toBeNull();
});

test('a source renders its srcset and sizes', () => {
  render(ImageSource, { props: { srcset: '/a-1x.jpg 1x, /a-2x.jpg 2x', sizes: '100vw' } });

  const source = document.querySelector('source')!;
  expect(source.getAttribute('srcset')).toBe('/a-1x.jpg 1x, /a-2x.jpg 2x');
  expect(source.getAttribute('sizes')).toBe('100vw');
});
