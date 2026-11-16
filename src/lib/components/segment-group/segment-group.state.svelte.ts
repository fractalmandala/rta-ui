import { createContext } from '../../internal/context';
import {
	createRadioGroup,
	type RadioGroupApi,
	type UseRadioGroupProps
} from '../radio-group/radio-group.state.svelte';

export type SegmentGroupValueChangeDetails = { value: string | null };
export type SegmentGroupApi = RadioGroupApi;

export type UseSegmentGroupProps = Omit<UseRadioGroupProps, 'orientation'> & {
	orientation?: 'horizontal' | 'vertical';
};

const segmentGroupContext = createContext<SegmentGroupApi>('SegmentGroup', 'SegmentGroup.Root');
export const useSegmentGroupContext = () => segmentGroupContext.get();
export const setSegmentGroupContext = (api: SegmentGroupApi) => segmentGroupContext.set(api);

export function createSegmentGroup(
	getProps: () => UseSegmentGroupProps,
	uid: string
): SegmentGroupApi {
	return createRadioGroup(() => ({ ...getProps(), orientation: getProps().orientation ?? 'horizontal' }), uid);
}
