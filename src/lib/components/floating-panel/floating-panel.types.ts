import type { FloatingPanelResizeTriggerAxis } from './floating-panel.state.svelte';

export const resizeTriggerAxes = [
	'n',
	'e',
	's',
	'w',
	'ne',
	'se',
	'sw',
	'nw'
] as const satisfies readonly FloatingPanelResizeTriggerAxis[];
