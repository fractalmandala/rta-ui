<script lang="ts">
  import type { Component } from 'svelte';

  import AlertDemo from './demos/Alert.svelte';
  import BadgeDemo from './demos/Badge.svelte';
  import BreadcrumbsDemo from './demos/Breadcrumbs.svelte';
  import ButtonDemo from './demos/Button.svelte';
  import CardDemo from './demos/Card.svelte';
  import CloseButtonDemo from './demos/CloseButton.svelte';
  import AngleSliderDemo from './demos/AngleSlider.svelte';
  import EditableDemo from './demos/Editable.svelte';
  import EmptyDemo from './demos/Empty.svelte';
  import FieldDemo from './demos/Field.svelte';
  import FieldsetDemo from './demos/Fieldset.svelte';
  import NativeSelectDemo from './demos/NativeSelect.svelte';
  import NumberInputDemo from './demos/NumberInput.svelte';
  import PasswordInputDemo from './demos/PasswordInput.svelte';
  import PinInputDemo from './demos/PinInput.svelte';
  import SignaturePadDemo from './demos/SignaturePad.svelte';
  import SliderDemo from './demos/Slider.svelte';
  import TagsInputDemo from './demos/TagsInput.svelte';
  import ImageDemo from './demos/Image.svelte';
  import InputDemo from './demos/Input.svelte';
  import InputGroupDemo from './demos/InputGroup.svelte';
  import KbdDemo from './demos/Kbd.svelte';
  import LayoutDemo from './demos/Layout.svelte';
  import ListDemo from './demos/List.svelte';
  import SeparatorDemo from './demos/Separator.svelte';
  import SkeletonDemo from './demos/Skeleton.svelte';
  import AccordionDemo from './demos/Accordion.svelte';
  import AvatarDemo from './demos/Avatar.svelte';
  import CheckboxDemo from './demos/Checkbox.svelte';
  import ClipboardDemo from './demos/Clipboard.svelte';
  import CollapsibleDemo from './demos/Collapsible.svelte';
  import HighlightDemo from './demos/Highlight.svelte';
  import MarqueeDemo from './demos/Marquee.svelte';
  import PaginationDemo from './demos/Pagination.svelte';
  import ProgressCircularDemo from './demos/ProgressCircular.svelte';
  import ProgressLinearDemo from './demos/ProgressLinear.svelte';
  import QrCodeDemo from './demos/QrCode.svelte';
  import RadioGroupDemo from './demos/RadioGroup.svelte';
  import RatingGroupDemo from './demos/RatingGroup.svelte';
  import ScrollAreaDemo from './demos/ScrollArea.svelte';
  import SegmentGroupDemo from './demos/SegmentGroup.svelte';
  import SplitterDemo from './demos/Splitter.svelte';
  import SwapDemo from './demos/Swap.svelte';
  import SwitchDemo from './demos/Switch.svelte';
  import StepsDemo from './demos/Steps.svelte';
  import TabsDemo from './demos/Tabs.svelte';
  import TimerDemo from './demos/Timer.svelte';
  import ToggleDemo from './demos/Toggle.svelte';
  import ToggleGroupDemo from './demos/ToggleGroup.svelte';
  import SpinnerDemo from './demos/Spinner.svelte';
  import TableDemo from './demos/Table.svelte';
  import TagDemo from './demos/Tag.svelte';
  import TypeDemo from './demos/Typography.svelte';
  import TypesetDemo from './demos/Typeset.svelte';

  type Demo = { name: string; note: string; component: Component<any> };

  const groups: { title: string; demos: Demo[] }[] = [
    {
      title: 'Actions',
      demos: [
        { name: 'Button', note: 'Six variants, five sizes, loading and asChild.', component: ButtonDemo },
        { name: 'CloseButton', note: 'An accessible dismiss control with a default label.', component: CloseButtonDemo },
        { name: 'Toggle', note: 'Pressed state with three variants and three sizes.', component: ToggleDemo },
        { name: 'ToggleGroup', note: 'Single or multiple selection with roving focus.', component: ToggleGroupDemo },
        { name: 'Swap', note: 'Two indicators crossfading on a boolean.', component: SwapDemo },
        { name: 'Clipboard', note: 'Copy-to-clipboard with a timed copied state.', component: ClipboardDemo },
        { name: 'RatingGroup', note: 'Star ratings with half steps.', component: RatingGroupDemo },
        { name: 'SegmentGroup', note: 'A radio group styled as segments.', component: SegmentGroupDemo },
      ],
    },
    {
      title: 'Typography',
      demos: [
        { name: 'Typography', note: 'Heading and Text with level, size and tone.', component: TypeDemo },
        { name: 'Typeset', note: 'Unstyled HTML prose straight from markdown.', component: TypesetDemo },
        { name: 'Kbd', note: 'Keyboard keys inline with text.', component: KbdDemo },
        { name: 'Badge', note: 'Four variants, three sizes.', component: BadgeDemo },
      ],
    },
    {
      title: 'Layout',
      demos: [
        { name: 'Layout', note: 'Container, Stack, SimpleGrid, AspectRatio and Bleed.', component: LayoutDemo },
        { name: 'Separator', note: 'Horizontal and vertical rules.', component: SeparatorDemo },
        { name: 'Splitter', note: 'Draggable and keyboard-resizable panels.', component: SplitterDemo },
      ],
    },
    {
      title: 'Content',
      demos: [
        { name: 'Card', note: 'Header, action, media, body and footer parts.', component: CardDemo },
        { name: 'List', note: 'Ordered, unordered and muted lists with indicators.', component: ListDemo },
        { name: 'Table', note: 'Caption, header, body, footer and a scroll area.', component: TableDemo },
        { name: 'Image', note: 'Layout presets, priority loading and picture sources.', component: ImageDemo },
        { name: 'Empty', note: 'Icon, title, description and actions.', component: EmptyDemo },
        { name: 'Avatar', note: 'Image with a fallback plus a stacked group.', component: AvatarDemo },
        { name: 'Collapsible', note: 'A single panel with an animated indicator.', component: CollapsibleDemo },
        { name: 'Accordion', note: 'Stacked collapsible items, single or multiple.', component: AccordionDemo },
        { name: 'Marquee', note: 'CSS-driven scrolling content with pause on hover.', component: MarqueeDemo },
        { name: 'Highlight', note: 'Marks query matches inside a string.', component: HighlightDemo },
        { name: 'ScrollArea', note: 'Custom scrollbars with fade and always-visible variants.', component: ScrollAreaDemo },
        { name: 'QRCode', note: 'Encodes a value into a swappable, downloadable QR frame.', component: QrCodeDemo },
      ],
    },
    {
      title: 'Forms',
      demos: [
        { name: 'Input', note: 'Text field with token sizing and two-way binding.', component: InputDemo },
        { name: 'InputGroup', note: 'Addons, text and a clear trigger around an input.', component: InputGroupDemo },
        { name: 'Tag', note: 'Labels with start elements and close triggers.', component: TagDemo },
        { name: 'Switch', note: 'A labelled binary control with a thumb.', component: SwitchDemo },
        { name: 'Checkbox', note: 'Checked, indeterminate and labelled states.', component: CheckboxDemo },
        { name: 'RadioGroup', note: 'Options sharing one roving radio group.', component: RadioGroupDemo },
        { name: 'Field', note: 'Label, helper and error text wired to a control.', component: FieldDemo },
        { name: 'Fieldset', note: 'A grouped legend with nested fields.', component: FieldsetDemo },
        { name: 'NativeSelect', note: 'The platform select with single or multiple values.', component: NativeSelectDemo },
        { name: 'Editable', note: 'Inline preview-to-edit with Enter, blur and Escape modes.', component: EditableDemo },
        { name: 'NumberInput', note: 'Steppers, scrubber, wheel and locale formatting.', component: NumberInputDemo },
        { name: 'PinInput', note: 'One cell per character with OTP and mask modes.', component: PinInputDemo },
        { name: 'PasswordInput', note: 'A visibility toggle wired into its field.', component: PasswordInputDemo },
        { name: 'TagsInput', note: 'Compose a value list with a validating input.', component: TagsInputDemo },
        { name: 'Slider', note: 'Single and multi-thumb values with markers.', component: SliderDemo },
        { name: 'AngleSlider', note: 'A circular dial with step markers.', component: AngleSliderDemo },
        { name: 'SignaturePad', note: 'Pointer-drawn paths exported as a data URL.', component: SignaturePadDemo },
      ],
    },
    {
      title: 'Feedback',
      demos: [
        { name: 'Alert', note: 'Four statuses with a matching data attribute.', component: AlertDemo },
        { name: 'Spinner', note: 'Five sizes, decorative or announced.', component: SpinnerDemo },
        { name: 'Skeleton', note: 'Pulse placeholders with pixel or CSS dimensions.', component: SkeletonDemo },
        { name: 'ProgressLinear', note: 'Determinate and indeterminate linear bars.', component: ProgressLinearDemo },
        { name: 'ProgressCircular', note: 'A ring with a centred value.', component: ProgressCircularDemo },
        { name: 'Timer', note: 'A count target with start, pause and reset.', component: TimerDemo },
      ],
    },
    {
      title: 'Navigation',
      demos: [
        { name: 'Breadcrumbs', note: 'Composed trail plus a data-driven path.', component: BreadcrumbsDemo },
        { name: 'Tabs', note: 'Animated indicator, roving tabindex, disabled tabs.', component: TabsDemo },
        { name: 'Pagination', note: 'Boundary and sibling pages around ellipses.', component: PaginationDemo },
        { name: 'Steps', note: 'A linear flow with prev/next triggers.', component: StepsDemo },
      ],
    },
  ];

  let active = $state('Actions');
</script>

<main>
  <header>
    <h1>rta ui</h1>
    <p>Sixty-one dependency-free Svelte 5 components. Ark-compatible parts, CSS Modules styling.</p>
  </header>

  <nav>
    {#each groups as group (group.title)}
      <button
        type="button"
        class:active={active === group.title}
        onclick={() => (active = group.title)}>{group.title}</button
      >
    {/each}
  </nav>

  {#each groups.filter((group) => group.title === active) as group (group.title)}
    {#each group.demos as demo (demo.name)}
      <section>
        <h2>{demo.name}</h2>
        <p class="note">{demo.note}</p>
        <div class="canvas">
          <demo.component />
        </div>
      </section>
    {/each}
  {/each}
</main>

<style>
  main {
    max-width: 60rem;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 6rem;
    display: grid;
    gap: 1.75rem;
  }
  header h1 {
    margin: 0 0 0.25rem;
    font-size: 1.75rem;
    letter-spacing: -0.02em;
  }
  header p {
    margin: 0;
    color: var(--moduix-muted-foreground);
    font-size: 0.875rem;
  }
  nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    position: sticky;
    top: 0;
    padding: 0.75rem 0;
    background: var(--moduix-background);
    border-bottom: 1px solid var(--moduix-border);
  }
  nav button {
    font: inherit;
    font-size: 0.8125rem;
    padding: 0.375rem 0.75rem;
    border-radius: 999px;
    border: 1px solid var(--moduix-border);
    background: transparent;
    color: var(--moduix-muted-foreground);
    cursor: pointer;
  }
  nav button.active {
    background: var(--moduix-primary);
    border-color: var(--moduix-primary);
    color: var(--moduix-primary-foreground);
  }
  section {
    display: grid;
    gap: 0.5rem;
  }
  section h2 {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 600;
  }
  .note {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--moduix-muted-foreground);
  }
  .canvas {
    padding: 1.25rem;
    border: 1px solid var(--moduix-border);
    border-radius: 0.75rem;
  }
</style>
