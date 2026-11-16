// Internal checked state for menu items whose `checked` prop is not bound. It lives in a `.svelte.ts`
// module because `$state` inside an option-item component trips svelte2tsx's rune detection.

export interface InternalCheckedOptions {
	getControlled: () => boolean | undefined;
	onChange?: (checked: boolean) => void;
}

export function createInternalChecked(options: InternalCheckedOptions) {
	let internal = $state(false);

	const set = (next: boolean) => {
		internal = next;
		options.onChange?.(next);
	};

	return {
		get checked() {
			return options.getControlled() ?? internal;
		},
		set
	};
}
