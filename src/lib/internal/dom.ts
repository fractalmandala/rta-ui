/** Boolean-as-presence attribute used by the Ark-compatible `data-*` contract. */
export function dataAttr(value: unknown): '' | undefined {
	return value ? '' : undefined;
}

export function toPx(value: number | undefined): string | undefined {
	return value == null ? undefined : `${value}px`;
}

export const visuallyHiddenStyle =
	'position:absolute;border:0;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;word-wrap:normal';

let focusVisibleSupported: boolean | undefined;

/** `:focus-visible` matching, degrading to keyboard heuristics where unsupported. */
export function isFocusVisible(element?: Element | null): boolean {
	if (focusVisibleSupported === undefined) {
		try {
			document.querySelector(':focus-visible');
			focusVisibleSupported = true;
		} catch {
			focusVisibleSupported = false;
		}
	}
	if (focusVisibleSupported) {
		return element ? element.matches(':focus-visible') : true;
	}
	return true;
}
