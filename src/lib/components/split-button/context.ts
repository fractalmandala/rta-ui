import { createContext } from '../../internal/context';
import type { ButtonSize, ButtonVariant } from '../button/Button.svelte';

export type SplitButtonSize = Exclude<ButtonSize, 'icon-sm' | 'icon-md' | 'icon-lg'>;
export type SplitButtonVariant = Exclude<ButtonVariant, 'link'>;

export interface SplitButtonContextValue {
	size: () => SplitButtonSize;
	variant: () => SplitButtonVariant;
}

const splitButtonContext = createContext<SplitButtonContextValue>('SplitButton', 'SplitButton');

export const setSplitButtonContext = (value: SplitButtonContextValue) =>
	splitButtonContext.set(value);

export const useSplitButtonContext = () => splitButtonContext.get();
