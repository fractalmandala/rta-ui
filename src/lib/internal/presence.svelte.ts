// Presence: keeps an element mounted while its exit animation runs. Mirrors Ark's `Presence`
// (lazyMount / unmountOnExit / skip); an element leaves the DOM only once every animation reported
// by `getAnimations()` settles, which is how Zag's presence machine decides too.

export interface PresenceOptions {
	present: () => boolean;
	/** The mounted element, once bound. */
	getNode: () => HTMLElement | null;
	lazyMount?: () => boolean;
	unmountOnExit?: () => boolean;
	skip?: () => boolean;
	onExitComplete?: () => void;
}

export interface PresenceApi {
	/** Whether the element should be in the DOM. */
	readonly present: boolean;
	readonly unmountOnExit: boolean;
	readonly skip: boolean;
	readonly dataState: 'open' | 'closed';
}

function settle(element: HTMLElement): Promise<void> {
	if (typeof element.getAnimations !== 'function') return Promise.resolve();
	const animations = element.getAnimations();
	if (!animations.length) return Promise.resolve();
	return Promise.all(animations.map((animation) => animation.finished)).then(
		() => undefined,
		() => undefined
	);
}

export function createPresence(options: PresenceOptions): PresenceApi {
	const lazy = () => options.lazyMount?.() ?? false;
	const keepOnExit = () => options.unmountOnExit?.() ?? false;
	const skip = () => options.skip?.() ?? false;

	let mounted = $state(options.present() || !lazy());
	let exiting = $state(false);
	let token = 0;

	$effect(() => {
		const open = options.present();
		const current = ++token;

		if (open) {
			mounted = true;
			exiting = false;
			return;
		}

		if (!mounted) return;

		if (!keepOnExit()) {
			options.onExitComplete?.();
			return;
		}

		if (skip()) {
			mounted = false;
			return;
		}

		exiting = true;
		requestAnimationFrame(() => {
			if (current !== token || options.present()) return;
			const element = options.getNode();
			if (!element) {
				mounted = false;
				exiting = false;
				options.onExitComplete?.();
				return;
			}
			void settle(element).then(() => {
				if (current !== token || options.present()) return;
				mounted = false;
				exiting = false;
				options.onExitComplete?.();
			});
		});
	});

	return {
		get present() {
			return mounted;
		},
		get unmountOnExit() {
			return keepOnExit();
		},
		get skip() {
			return skip();
		},
		get dataState() {
			return options.present() && !exiting ? 'open' : 'closed';
		}
	};
}
