export interface WaitOptions {
	timeout?: number;
	rootNode?: Node;
}

export interface WaitForEventOptions {
	predicate?: (element: HTMLElement) => boolean;
	capture?: boolean;
	once?: boolean;
	passive?: boolean;
	signal?: AbortSignal;
}

function createTimeout<T>(promise: Promise<T>, timeout: number | undefined): Promise<T> {
	if (!timeout) return promise;
	return new Promise<T>((resolve, reject) => {
		const timer = setTimeout(() => {
			reject(new Error('[tour] Timed out waiting for the target'));
		}, timeout);
		promise.then(
			(value) => {
				clearTimeout(timer);
				resolve(value);
			},
			(error) => {
				clearTimeout(timer);
				reject(error);
			}
		);
	});
}

/** Resolves once the target getter returns an element. */
export function waitForElement(
	target: () => HTMLElement | null | undefined,
	options: WaitOptions = {}
): Promise<HTMLElement> {
	const rootNode = options.rootNode ?? (typeof document === 'undefined' ? null : document.documentElement);
	if (!rootNode) return Promise.reject(new Error('[tour] No root node to observe'));

	const promise = new Promise<HTMLElement>((resolve) => {
		const existing = target();
		if (existing) {
			resolve(existing);
			return;
		}
		const observer = new MutationObserver(() => {
			const node = target();
			if (!node) return;
			observer.disconnect();
			resolve(node);
		});
		observer.observe(rootNode, { childList: true, subtree: true, characterData: true });
	});

	return createTimeout(promise, options.timeout);
}

/** Resolves once the target element's value matches. */
export function waitForElementValue(
	target: () => HTMLElement | null | undefined,
	value: string,
	options: WaitOptions = {}
): Promise<void> {
	const element = target();
	if (!element) return Promise.reject(new Error('[tour] No element to watch'));

	const promise = new Promise<void>((resolve) => {
		const check = () => {
			if ((element as HTMLInputElement).value !== value) return;
			element.removeEventListener('input', check);
			resolve();
		};
		check();
		element.addEventListener('input', check);
	});

	return createTimeout(promise, options.timeout);
}

export function waitForPromise<T>(
	promise: Promise<T>,
	options: WaitOptions = {}
): Promise<T> {
	return createTimeout(promise, options.timeout);
}

/** Resolves with the event and returns its cleanup, mirroring Ark's helper. */
export function waitForEvent(
	target: () => HTMLElement | null | undefined,
	event: string,
	options: WaitForEventOptions = {}
): [Promise<Event>, () => void] {
	const { predicate, ...listenerOptions } = options;
	let cleanup: (() => void) | undefined;
	const promise = new Promise<Event>((resolve) => {
		const element = target();
		if (!element) return;
		const handler = (eventObject: Event) => {
			if (predicate && !predicate(element)) return;
			resolve(eventObject);
			cleanup?.();
		};
		element.addEventListener(event, handler, listenerOptions);
		cleanup = () => element.removeEventListener(event, handler, listenerOptions);
	});
	return [promise, () => cleanup?.()];
}
