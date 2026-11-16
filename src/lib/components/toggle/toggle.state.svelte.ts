import { createContext } from '../../internal/context';

export type ToggleSize = 'xs' | 'sm' | 'md' | 'lg' | 'icon-sm' | 'icon-md' | 'icon-lg';
export type ToggleVariant = 'default' | 'outline' | 'ghost';

export interface TogglePressedChangeDetails {
	pressed: boolean;
}

export interface UseToggleProps {
	pressed?: boolean;
	defaultPressed?: boolean;
	onPressedChange?: (details: TogglePressedChangeDetails) => void;
	disabled?: boolean;
}

export interface ToggleApi {
	readonly pressed: boolean;
	readonly disabled: boolean;
	readonly state: 'on' | 'off';
	setPressed(next: boolean): void;
	toggle(): void;
}

const toggleContext = createContext<ToggleApi>('Toggle', 'Toggle.Root');
export const useToggleContext = () => toggleContext.get();
export const setToggleContext = (api: ToggleApi) => toggleContext.set(api);

export function createToggle(getProps: () => UseToggleProps): ToggleApi {
	let internalPressed = $state(getProps().defaultPressed ?? getProps().pressed ?? false);
	const isControlled = () => getProps().pressed !== undefined;
	const pressed = () => (isControlled() ? Boolean(getProps().pressed) : internalPressed);

	function setPressed(next: boolean) {
		if (getProps().disabled || pressed() === next) return;
		if (!isControlled()) internalPressed = next;
		getProps().onPressedChange?.({ pressed: next });
	}

	return {
		get pressed() {
			return pressed();
		},
		get disabled() {
			return Boolean(getProps().disabled);
		},
		get state() {
			return pressed() ? 'on' : 'off';
		},
		setPressed,
		toggle() {
			setPressed(!pressed());
		}
	};
}
