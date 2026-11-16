import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import type { Component } from 'svelte';
import * as ui from '../src/lib/index';
import AsChild from './harness/AsChild.svelte';
import Ref from './harness/Ref.svelte';

const text = createRawSnippet(() => ({ render: () => '<span data-testid="child">child</span>' }));

type RootCase = {
  name: string;
  component: Component<any>;
  props?: Record<string, unknown>;
  slot: string;
  scope: string;
  part: string;
  /** `Image` renders one native `<img>` and has no element to swap. */
  asChild?: false;
};

// Every public root in the Phase 1 tier, with the styling hooks it must emit. The CSS Modules
// in this package key on these attributes, so a missing hook is a visual regression.
const roots: RootCase[] = [
  { name: 'Alert', component: ui.Alert, slot: 'alert-root', scope: 'alert', part: 'root' },
  {
    name: 'AspectRatio',
    component: ui.AspectRatio,
    props: { ratio: 16 / 9 },
    slot: 'aspect-ratio-root',
    scope: 'aspect-ratio',
    part: 'root',
  },
  { name: 'Badge', component: ui.Badge, slot: 'badge-root', scope: 'badge', part: 'root' },
  { name: 'Bleed', component: ui.Bleed, slot: 'bleed-root', scope: 'bleed', part: 'root' },
  {
    name: 'Breadcrumbs',
    component: ui.Breadcrumbs,
    slot: 'breadcrumbs-root',
    scope: 'breadcrumbs',
    part: 'root',
  },
  { name: 'Button', component: ui.Button, slot: 'button-root', scope: 'button', part: 'root' },
  { name: 'Card', component: ui.Card, slot: 'card-root', scope: 'card', part: 'root' },
  {
    name: 'CloseButton',
    component: ui.CloseButton,
    slot: 'close-button-root',
    scope: 'close-button',
    part: 'root',
  },
  {
    name: 'Container',
    component: ui.Container,
    slot: 'container-root',
    scope: 'container',
    part: 'root',
  },
  { name: 'Empty', component: ui.Empty, slot: 'empty-root', scope: 'empty', part: 'root' },
  { name: 'Heading', component: ui.Heading, slot: 'heading-root', scope: 'heading', part: 'root' },
  {
    name: 'Image',
    component: ui.Image,
    props: { src: '/photo.jpg', alt: 'A photo' },
    slot: 'image-root',
    scope: undefined as never,
    part: undefined as never,
    asChild: false,
  },
  {
    name: 'Input',
    component: ui.Input,
    slot: 'input-root',
    scope: 'field',
    part: 'input',
  },
  {
    name: 'InputGroup',
    component: ui.InputGroup,
    slot: 'input-group-root',
    scope: 'input-group',
    part: 'root',
  },
  { name: 'Kbd', component: ui.Kbd, slot: 'kbd-root', scope: 'kbd', part: 'root' },
  { name: 'List', component: ui.List, slot: 'list-root', scope: 'list', part: 'root' },
  {
    name: 'Separator',
    component: ui.Separator,
    slot: 'separator-root',
    scope: 'separator',
    part: 'root',
  },
  {
    name: 'SimpleGrid',
    component: ui.SimpleGrid,
    slot: 'simple-grid-root',
    scope: 'simple-grid',
    part: 'root',
  },
  {
    name: 'Skeleton',
    component: ui.Skeleton,
    slot: 'skeleton-root',
    scope: 'skeleton',
    part: 'root',
  },
  { name: 'Spinner', component: ui.Spinner, slot: 'spinner-root', scope: 'spinner', part: 'root' },
  { name: 'Stack', component: ui.Stack, slot: 'stack-root', scope: 'stack', part: 'root' },
  { name: 'Table', component: ui.Table, slot: 'table-root', scope: 'table', part: 'root' },
  { name: 'Tag', component: ui.Tag, slot: 'tag-root', scope: 'tag', part: 'root' },
  { name: 'Text', component: ui.Text, slot: 'text-root', scope: 'text', part: 'root' },
  {
    name: 'Textarea',
    component: ui.Textarea,
    slot: 'textarea-root',
    scope: 'field',
    part: 'textarea',
  },
  { name: 'Typeset', component: ui.Typeset, slot: 'typeset-root', scope: 'typeset', part: 'root' },
];

describe('component roots', () => {
  for (const root of roots) {
    test(`${root.name} emits its styling hooks`, () => {
      render(root.component, { props: { children: text, ...root.props } });

      const element = document.querySelector(`[data-slot="${root.slot}"]`);
      expect(element, `${root.name} root`).not.toBeNull();
      if (root.scope) expect(element!.getAttribute('data-scope')).toBe(root.scope);
      if (root.part) expect(element!.getAttribute('data-part')).toBe(root.part);
      expect(element!.className).toContain('root');
    });

    test.skipIf(root.asChild === false)(`${root.name} renders a composed child through asChild`, () => {
      render(AsChild, { props: { component: root.component, props: root.props } });

      const composed = screen.getByTestId('composed');
      expect(composed.tagName).toBe('A');
      expect(composed.getAttribute('href')).toBe('#composed');
      expect(composed.getAttribute('data-own')).toBe('yes');
      expect(composed.getAttribute('data-slot')).toBe(root.slot);
      expect(composed.className).toContain('root');
    });

    test(`${root.name} forwards its element through bind:ref`, () => {
      let node: unknown = null;
      render(Ref, {
        props: {
          component: root.component,
          props: { children: text, ...root.props },
          onRef: (value: unknown) => (node = value),
        },
      });

      const element = document.querySelector(`[data-slot="${root.slot}"]`);
      expect(node).toBe(element);
    });
  }
});
