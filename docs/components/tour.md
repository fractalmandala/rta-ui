---
title: Tour
component: tour
description: Walk users through a product with steps anchored to page elements.
---

# Tour

Walk users through a product with steps anchored to page elements.

Port of `moduix/packages/svelte/src/components/tour` with the same public parts and a byte-identical CSS Module, rebuilt on `src/lib/internal` instead of Ark UI.

## Installation

```sh
pnpm add rta-ui
```

`rta-ui` ships one flat export surface, plus the tokens in `rta-ui/style.css`:

```svelte
<script lang="ts">
	import { Tour } from 'rta-ui';
	import 'rta-ui/style.css';
</script>
```

## Anatomy

| export | file | role |
| --- | --- | --- |
| `Tour` | `Tour.svelte` | `—` |
| `TourActionList` | `TourActionList.svelte` | `—` |
| `TourActions` | `TourActions.svelte` | `—` |
| `TourActionTrigger` | `TourActionTrigger.svelte` | `—` |
| `TourArrow` | `TourArrow.svelte` | `—` |
| `TourArrowTip` | `TourArrowTip.svelte` | `—` |
| `TourBackdrop` | `TourBackdrop.svelte` | `—` |
| `TourBody` | `TourBody.svelte` | `—` |
| `TourCloseIcon` | `TourCloseIcon.svelte` | `—` |
| `TourCloseTrigger` | `TourCloseTrigger.svelte` | `—` |
| `TourContent` | `TourContent.svelte` | `dialog` |
| `TourContext` | `TourContext.svelte` | `—` |
| `TourControl` | `TourControl.svelte` | `—` |
| `TourDescription` | `TourDescription.svelte` | `—` |
| `TourPositioner` | `TourPositioner.svelte` | `—` |
| `TourProgressBar` | `TourProgressBar.svelte` | `progressbar` |
| `TourProgressText` | `TourProgressText.svelte` | `—` |
| `TourSpotlight` | `TourSpotlight.svelte` | `—` |
| `TourTitle` | `TourTitle.svelte` | `—` |

`Tour`, `TourActions`, `TourContext` render no element of their own: they create the state and provide it to the other parts.

ARIA roles rendered by this family: `dialog`, `progressbar`.

## Props

### `Tour` — `TourRootProps`
adds to `UseTourProps`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `id` | `string \| null` | — | from `UseTourProps` |
| `ids` | `TourElementIds` | — | from `UseTourProps` |
| `steps` | `TourStepDetails[]` | — | from `UseTourProps` |
| `stepId` | `string \| null` | — | from `UseTourProps` |
| `onStepChange` | `((details: TourStepChangeDetails) => void) \| undefined` | — | from `UseTourProps` |
| `onStepsChange` | `((details: TourStepsChangeDetails) => void) \| undefined` | — | from `UseTourProps` |
| `onStatusChange` | `((details: TourStatusChangeDetails) => void) \| undefined` | — | from `UseTourProps` |
| `closeOnInteractOutside` | `boolean` | — | from `UseTourProps` |
| `closeOnEscape` | `boolean` | — | from `UseTourProps` |
| `keyboardNavigation` | `boolean` | — | from `UseTourProps` |
| `preventInteraction` | `boolean` | — | from `UseTourProps` |
| `spotlightOffset` | `Point` | — | from `UseTourProps` |
| `spotlightRadius` | `number` | — | from `UseTourProps` |
| `scrollToTargetFn` | `((details: { target: HTMLElement; step: TourStepDetails }) => void) \| undefined` | — | from `UseTourProps` |
| `translations` | `TourIntlTranslations` | — | from `UseTourProps` |
| `dir` | `'ltr' \| 'rtl' \| 'auto' \| null` | — | from `UseTourProps` |
| `portalled` | `boolean` | — | from `UseTourProps` |
| `portalRef` | `TourPortalRef` | — | from `UseTourProps` |
| `lazyMount` | `boolean` | — | from `UseTourProps` |
| `unmountOnExit` | `boolean` | — | from `UseTourProps` |
| `onExitComplete` | `() => void` | — | from `UseTourProps` |
| `onFocusOutside` | `(event: TourFocusOutsideEvent) => void` | — | from `UseTourProps` |
| `onPointerDownOutside` | `(event: TourPointerDownOutsideEvent) => void` | — | from `UseTourProps` |
| `onInteractOutside` | `(event: TourInteractOutsideEvent) => void` | — | from `UseTourProps` |
| `tour` | `TourApi` | — |  |
| `children` | `Snippet` | — |  |

### `TourActionList` — `TourActionListProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `class` | `ClassValue \| null` | — |  |

### `TourActions` — `TourActionsProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `children` | `Snippet<[() => TourStepAction[]]>` | — |  |

### `TourActionTrigger` — `TourActionTriggerProps`
accepts the native props of `HTMLProps<'button'>`, `Omit<PolymorphicProps<'button'>, 'type' | 'disabled'>`, `RefAttribute<HTMLButtonElement>`.

| prop | type | default | notes |
| --- | --- | --- | --- |
| `action` | `TourStepAction` | — |  |

### `TourContext` — `TourContextProps`
| prop | type | default | notes |
| --- | --- | --- | --- |
| `render` | `Snippet<[TourApi]>` | — |  |


## Styling hooks

| part file | `data-scope` | `data-part` | `data-slot` |
| --- | --- | --- | --- |
| `TourActionTrigger` | `tour` | `action-trigger` | `tour-action-trigger` |
| `TourArrow` | `tour` | `arrow` | `tour-arrow` |
| `TourArrowTip` | `tour` | `arrow-tip` | `tour-arrow-tip` |
| `TourBackdrop` | `tour` | `backdrop` | `tour-backdrop` |
| `TourBody` | `tour` | `body` | `tour-body` |
| `TourCloseIcon` | `—` | `—` | `tour-close-icon` |
| `TourCloseTrigger` | `tour` | `close-trigger` | `—` |
| `TourContent` | `tour` | `content` | `tour-content` |
| `TourControl` | `tour` | `control` | `tour-control` |
| `TourDescription` | `tour` | `description` | `tour-description` |
| `TourPositioner` | `tour` | `positioner` | `tour-positioner` |
| `TourProgressBar` | `tour` | `progress-bar` | `tour-progress-bar` |
| `TourProgressText` | `tour` | `progress-text` | `tour-progress-text` |
| `TourSpotlight` | `tour` | `spotlight` | `tour-spotlight` |
| `TourTitle` | `tour` | `title` | `tour-title` |

## Keyboard

Keys handled by this family: `Enter`, `dismiss`, `next`, `prev`, `skip`, `←SpaceArrowLeft`, `→SpaceArrowRight`.

## Generated ids

- `width: ${id}%;`

Every id is overridable through the `ids` prop.

## Overview example source

The component above is this file, unchanged:

```svelte
<script lang="ts">
	import Tour from '../../lib/components/tour/Tour.svelte';
	import TourActionList from '../../lib/components/tour/TourActionList.svelte';
	import TourArrow from '../../lib/components/tour/TourArrow.svelte';
	import TourBackdrop from '../../lib/components/tour/TourBackdrop.svelte';
	import TourBody from '../../lib/components/tour/TourBody.svelte';
	import TourCloseIcon from '../../lib/components/tour/TourCloseIcon.svelte';
	import TourContent from '../../lib/components/tour/TourContent.svelte';
	import TourControl from '../../lib/components/tour/TourControl.svelte';
	import TourDescription from '../../lib/components/tour/TourDescription.svelte';
	import TourPositioner from '../../lib/components/tour/TourPositioner.svelte';
	import TourProgressBar from '../../lib/components/tour/TourProgressBar.svelte';
	import TourProgressText from '../../lib/components/tour/TourProgressText.svelte';
	import TourSpotlight from '../../lib/components/tour/TourSpotlight.svelte';
	import TourTitle from '../../lib/components/tour/TourTitle.svelte';
	import { createTour } from '../../lib/components/tour/tour.state.svelte';
	import type { TourStepDetails } from '../../lib/components/tour/tour.state.svelte';

	const steps = [
		{
			id: 'welcome',
			type: 'dialog',
			title: 'Welcome to the workspace',
			description: 'Start with a dialog step, then move to a highlighted page control.',
			actions: [{ label: 'Start', action: 'next' }]
		},
		{
			id: 'upload',
			type: 'tooltip',
			title: 'Upload files',
			description: 'Tooltip steps are anchored to the target element.',
			target: () => document.getElementById('tour-demo-upload'),
			actions: [
				{ label: 'Back', action: 'prev' },
				{ label: 'Next', action: 'next' }
			]
		},
		{
			id: 'finish',
			type: 'floating',
			placement: 'bottom-end',
			title: 'You are ready',
			description: 'Floating steps stay in the viewport without a target.',
			actions: [{ label: 'Finish', action: 'dismiss' }]
		}
	] satisfies TourStepDetails[];

	const tour = createTour(() => ({ steps, spotlightRadius: 6 }), 'demo-tour');
</script>

<div class="demo-row">
	<button type="button" id="tour-demo-upload">Upload files</button>
	<button type="button" onclick={() => tour.start()}>Start tour</button>
	<button type="button" onclick={() => tour.next()}>Next step</button>
	<button type="button" onclick={() => tour.dismiss()}>End tour</button>
</div>

<Tour {tour}>
	<TourBackdrop />
	<TourSpotlight />
	<TourPositioner>
		<TourArrow />
		<TourContent>
			<TourCloseIcon />
			<TourBody>
				<TourTitle />
				<TourDescription />
				<TourProgressText />
				<TourProgressBar />
			</TourBody>
			<TourControl>
				<TourActionList />
			</TourControl>
		</TourContent>
	</TourPositioner>
</Tour>
```

## Behaviour covered by tests

- opens on a dialog step with the aria and id contract
- moves to a tooltip step, positions it and cuts the spotlight
- -
- -
- navigates with the keyboard and ignores it when disabled
- closes on escape and restores focus to the page
- restarts from the first step when started again while open
- does not close on escape when closeOnEscape is false
- runs the step actions and reports their disabled state
- dismisses through the close trigger, the finish action and skip
- dismisses on an outside pointer but not on the highlighted target
- renders the progress bar and the highlighted target contract
- waits for a late mounted target before opening the step
- marks the target inert when interaction is prevented
- renders nothing while closed for the props based root

## Notes

- **Parity:** accepted deviation — Upstream only ships a progress label; here a progress bar is a public part so a step indicator can be rendered.
  Extra slots: `tour-progress-bar`, `tour-progress-bar-fill`.

---

Generated by `pnpm docs` from the component source, its gallery demo and its tests. Edit the source, not this file.
