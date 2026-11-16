import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';

export interface UseSwapProps {
	swap?: boolean;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
}

export interface SwapIndicatorAttrsOptions {
	type: 'on' | 'off';
}

export interface SwapApi {
	readonly swapped: boolean;
	rootAttrs(): Record<string, unknown>;
	indicatorAttrs(options: SwapIndicatorAttrsOptions): Record<string, unknown>;
	onAttrs(): Record<string, unknown>;
	offAttrs(): Record<string, unknown>;
}

const swapContext = createContext<SwapApi>('Swap', 'Swap.Root');
export const useSwapContext = () => swapContext.get();
export const setSwapContext = (api: SwapApi) => swapContext.set(api);

export function createSwap(getProps: () => UseSwapProps): SwapApi {
	const swapped = () => getProps().swap === true;

	function indicatorAttrs({ type }: SwapIndicatorAttrsOptions) {
		const active = type === 'on' ? swapped() : !swapped();
		return {
			'data-type': type,
			'data-state': active ? 'open' : 'closed',
			'data-swap': active ? 'on' : 'off',
			hidden: !active,
			style: 'grid-area: 1 / 1; display: inline-flex'
		};
	}

	return {
		indicatorAttrs,
		onAttrs: () => indicatorAttrs({ type: 'on' }),
		offAttrs: () => indicatorAttrs({ type: 'off' }),
		rootAttrs() {
			return {
				id: getProps().id ?? undefined,
				dir: getProps().dir ?? undefined,
				'data-swap': swapped() ? 'on' : 'off',
				'data-state': swapped() ? 'open' : 'closed',
				'data-active': dataAttr(swapped()),
				style: 'display: inline-grid'
			};
		},
		get swapped() {
			return swapped();
		}
	};
}
