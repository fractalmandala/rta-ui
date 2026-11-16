import { createContext } from '../../internal/context';
import { createCheckable } from '../../internal/checkable.svelte.js';
import type { CheckableApi, CheckableProps } from '../../internal/checkable.svelte.js';

export type SwitchSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface UseSwitchProps extends CheckableProps {
	/** Text used by the visually hidden input's accessible name. */
	label?: string;
}

export type SwitchApi = CheckableApi;

const switchContext = createContext<SwitchApi>('Switch', 'Switch.Root');
export const useSwitchContext = () => switchContext.get();
export const setSwitchContext = (api: SwitchApi) => switchContext.set(api);

export function createSwitch(getProps: () => UseSwitchProps, uid: string): SwitchApi {
	return createCheckable('switch', getProps, uid);
}
