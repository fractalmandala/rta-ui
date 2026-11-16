export interface PanelMotionOptions {
	/** Whether the panel should be open. */
	getOpen: () => boolean;
	/** The panel element, once bound. */
	getNode: () => HTMLElement | null;
	getCollapsedHeight?: () => number | undefined;
	getCollapsedWidth?: () => number | undefined;
	onExitComplete?: () => void;
}

export interface PanelMotion {
	readonly state: 'open' | 'closed';
	/** `hidden` until the exit animation finishes, unless a collapsed size keeps the panel visible. */
	readonly hidden: boolean;
	/** Collapsed panels stay in the layout but must not be tabbable. */
	readonly inert: boolean;
	/** Suppressed on first render of an initially open panel, so it does not animate in on mount. */
	readonly suppressed: boolean;
}

function parseTime(value: string): number {
	const trimmed = value.trim();
	if (!trimmed) return 0;
	return trimmed.endsWith('ms') ? Number.parseFloat(trimmed) : Number.parseFloat(trimmed) * 1000;
}

function longestAnimation(element: HTMLElement): number {
	const style = getComputedStyle(element);
	const names = style.animationName.split(',').map((name) => name.trim()).filter((name) => name && name !== 'none');
	if (!names.length) return 0;

	const durations = style.animationDuration.split(',');
	const delays = style.animationDelay.split(',');
	let total = 0;
	for (let index = 0; index < names.length; index += 1) {
		const duration = parseTime(durations[index % durations.length] ?? '0s');
		const delay = parseTime(delays[index % delays.length] ?? '0s');
		total = Math.max(total, duration + delay);
	}
	return total;
}

export function createPanelMotion(options: PanelMotionOptions): PanelMotion {
	const hasCollapsedHeight = () => options.getCollapsedHeight?.() != null;
	const hasCollapsedWidth = () => options.getCollapsedWidth?.() != null;
	const hasCollapsedSize = () => hasCollapsedHeight() || hasCollapsedWidth();

	const initiallyOpen = options.getOpen();

	let viewState = $state<'open' | 'closed'>(initiallyOpen ? 'open' : 'closed');
	let viewVisible = $state(initiallyOpen);
	let viewSuppressed = $state(initiallyOpen);
	let viewInert = $state(false);

	let mirror: 'open' | 'closed' = initiallyOpen ? 'open' : 'closed';
	let exitTimer: ReturnType<typeof setTimeout> | undefined;

	function applySizes(element: HTMLElement) {
		const rect = element.getBoundingClientRect();
		element.style.setProperty('--height', `${rect.height}px`);
		element.style.setProperty('--width', `${rect.width}px`);
		const collapsedHeight = options.getCollapsedHeight?.();
		const collapsedWidth = options.getCollapsedWidth?.();
		element.style.setProperty('--collapsed-height', collapsedHeight == null ? '' : `${collapsedHeight}px`);
		element.style.setProperty('--collapsed-width', collapsedWidth == null ? '' : `${collapsedWidth}px`);
	}

	function applyCollapsedBox(element: HTMLElement) {
		const collapsedHeight = options.getCollapsedHeight?.();
		const collapsedWidth = options.getCollapsedWidth?.();
		element.style.overflow = hasCollapsedSize() ? 'hidden' : '';
		element.style.minHeight = collapsedHeight == null ? '' : `${collapsedHeight}px`;
		element.style.maxHeight = collapsedHeight == null ? '' : `${collapsedHeight}px`;
		element.style.minWidth = collapsedWidth == null ? '' : `${collapsedWidth}px`;
		element.style.maxWidth = collapsedWidth == null ? '' : `${collapsedWidth}px`;
	}

	function cancelExit() {
		if (exitTimer !== undefined) clearTimeout(exitTimer);
		exitTimer = undefined;
	}

	function finishExit(onDone: () => void) {
		viewVisible = false;
		onDone();
	}

	function waitForExit(element: HTMLElement) {
		cancelExit();
		const onDone = () => options.onExitComplete?.();
		const total = longestAnimation(element);
		if (total === 0) {
			finishExit(onDone);
			return;
		}
		const onEnd = (event: AnimationEvent) => {
			if (event.target !== element) return;
			element.removeEventListener('animationend', onEnd);
			cancelExit();
			finishExit(onDone);
		};
		element.addEventListener('animationend', onEnd);
		exitTimer = setTimeout(() => {
			element.removeEventListener('animationend', onEnd);
			exitTimer = undefined;
			finishExit(onDone);
		}, total + 50);
	}

	function enter(element: HTMLElement) {
		if (mirror === 'open' && viewVisible && !viewInert) return;
		cancelExit();
		viewInert = false;
		element.hidden = false;
		viewVisible = true;
		if (mirror === 'open') return;

		applySizes(element);
		element.style.overflow = '';
		element.style.minHeight = '';
		element.style.maxHeight = '';
		element.style.minWidth = '';
		element.style.maxWidth = '';
		mirror = 'open';
		viewSuppressed = false;
		viewState = 'open';
	}

	function exit(element: HTMLElement) {
		if (mirror === 'closed') {
			applyCollapsedBox(element);
			viewInert = hasCollapsedSize();
			return;
		}

		cancelExit();
		applySizes(element);
		mirror = 'closed';
		viewSuppressed = false;
		viewState = 'closed';

		if (hasCollapsedSize()) {
			applyCollapsedBox(element);
			viewVisible = true;
			viewInert = true;
			options.onExitComplete?.();
			return;
		}

		element.style.overflow = '';
		applyCollapsedBox(element);
		viewInert = true;
		waitForExit(element);
	}

	$effect(() => {
		const element = options.getNode();
		if (!element) return;
		if (options.getOpen()) enter(element);
		else exit(element);
	});

	return {
		get state() {
			return viewState;
		},
		get hidden() {
			return !viewVisible && !hasCollapsedSize();
		},
		get inert() {
			return viewInert;
		},
		get suppressed() {
			return viewSuppressed;
		},
	};
}
