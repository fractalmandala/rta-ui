import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';

export interface RatingGroupValueChangeDetails {
	value: number;
}

export interface RatingGroupHoverChangeDetails {
	hoveredValue: number;
}

export interface UseRatingGroupProps {
	value?: number;
	defaultValue?: number;
	count?: number;
	allowHalf?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	name?: string;
	form?: string;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: {
		root?: string;
		label?: string;
		control?: string;
		hiddenInput?: string;
		item?: (index: number) => string;
	};
	translations?: { ratingValueText?: (index: number) => string };
	onValueChange?: (details: RatingGroupValueChangeDetails) => void;
	onHoverChange?: (details: RatingGroupHoverChangeDetails) => void;
}

export interface RatingGroupItemState {
	index: number;
	checked: boolean;
	highlighted: boolean;
	half: boolean;
}

export interface RatingGroupApi {
	readonly value: number;
	readonly hoveredValue: number;
	readonly count: number;
	readonly items: number[];
	readonly disabled: boolean;
	readonly readOnly: boolean;
	readonly required: boolean;
	readonly dir: 'ltr' | 'rtl' | 'auto' | null | undefined;
	readonly rootId: string;
	readonly labelId: string;
	readonly controlId: string;
	readonly hiddenInputId: string;
	itemId(index: number): string;
	itemState(index: number): RatingGroupItemState;
	setValue(next: number): void;
	clearValue(): void;
	setHovered(next: number): void;
	rootAttrs(): Record<string, unknown>;
	labelAttrs(): Record<string, unknown>;
	controlAttrs(): Record<string, unknown>;
	hiddenInputAttrs(): Record<string, unknown>;
	itemAttrs(index: number): Record<string, unknown>;
	itemIndicatorAttrs(index: number): Record<string, unknown>;
}

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	return Object.fromEntries(
		Object.entries(value).filter(([, entry]) => entry !== undefined)
	) as T;
}

const ratingGroupContext = createContext<RatingGroupApi>('RatingGroup', 'RatingGroup.Root');
export const useRatingGroupContext = () => ratingGroupContext.get();
export const setRatingGroupContext = (api: RatingGroupApi) => ratingGroupContext.set(api);

const itemContext = createContext<() => RatingGroupItemState>('RatingGroup', 'RatingGroup.Item');
export const useRatingGroupItemContext = () => itemContext.get();
export const setRatingGroupItemContext = (state: () => RatingGroupItemState) =>
	itemContext.set(state);

export function createRatingGroup(
	getProps: () => UseRatingGroupProps,
	uid: string
): RatingGroupApi {
	const rootId = () => getProps().ids?.root ?? getProps().id ?? `rating-group:${uid}`;
	const labelId = () => getProps().ids?.label ?? `${rootId()}:label`;
	const controlId = () => getProps().ids?.control ?? `${rootId()}:control`;
	const hiddenInputId = () => getProps().ids?.hiddenInput ?? `${rootId()}:input`;
	const itemId = (index: number) =>
		getProps().ids?.item?.(index) ?? `${rootId()}:item:${index}`;

	let internalValue = $state(getProps().defaultValue ?? getProps().value ?? -1);
	let internalHovered = $state(-1);

	const isControlled = () => getProps().value !== undefined;
	const value = () => (isControlled() ? (getProps().value ?? -1) : internalValue);
	const hoveredValue = () => internalHovered;
	const count = () => getProps().count ?? 5;
	const interactive = () => !getProps().disabled && !getProps().readOnly;
	const factor = () => (getProps().allowHalf ? 0.5 : 1);

	function setValue(next: number) {
		if (!interactive()) return;
		const clamped = Math.max(0, Math.min(count(), next));
		if (!isControlled()) internalValue = clamped;
		getProps().onValueChange?.({ value: clamped });
	}

	function clearValue() {
		if (!interactive()) return;
		if (!isControlled()) internalValue = -1;
		getProps().onValueChange?.({ value: -1 });
	}

	function itemState(index: number): RatingGroupItemState {
		const current = hoveredValue() > -1 ? hoveredValue() : value();
		const equal = Math.ceil(current) === index;
		return {
			index,
			checked: equal || (value() <= 0 && index === 1),
			highlighted: index <= current || equal,
			half: equal && Math.abs(current - index) === 0.5
		};
	}

	function valueText(index: number) {
		const format = getProps().translations?.ratingValueText ?? ((n: number) => `${n} stars`);
		return format(index);
	}

	return {
		itemId,
		itemState,
		setValue,
		clearValue,
		setHovered(next) {
			internalHovered = next;
			getProps().onHoverChange?.({ hoveredValue: next });
		},
		rootAttrs() {
			return dropUndefined({ id: rootId(), dir: getProps().dir ?? undefined });
		},
		labelAttrs() {
			return dropUndefined({
				id: labelId(),
				dir: getProps().dir ?? undefined,
				for: hiddenInputId(),
				'data-disabled': dataAttr(Boolean(getProps().disabled)),
				'data-required': dataAttr(Boolean(getProps().required))
			});
		},
		controlAttrs() {
			return dropUndefined({
				id: controlId(),
				dir: getProps().dir ?? undefined,
				role: 'radiogroup',
				'aria-orientation': 'horizontal',
				'aria-labelledby': labelId(),
				'aria-readonly': getProps().readOnly || undefined,
				'data-readonly': dataAttr(Boolean(getProps().readOnly)),
				'data-disabled': dataAttr(Boolean(getProps().disabled))
			});
		},
		hiddenInputAttrs() {
			return dropUndefined({
				id: hiddenInputId(),
				name: getProps().name ?? undefined,
				form: getProps().form ?? undefined,
				type: 'text',
				hidden: true,
				disabled: Boolean(getProps().disabled),
				readOnly: Boolean(getProps().readOnly),
				required: Boolean(getProps().required),
				defaultValue: value()
			});
		},
		itemAttrs(index) {
			const state = itemState(index);
			const checked = Math.ceil(hoveredValue() > -1 ? hoveredValue() : value()) === index;
			return dropUndefined({
				id: itemId(index),
				dir: getProps().dir ?? undefined,
				role: 'radio',
				tabindex: (() => {
					if (getProps().readOnly) return state.checked ? 0 : undefined;
					if (getProps().disabled) return undefined;
					return state.checked ? 0 : -1;
				})(),
				'aria-roledescription': 'rating',
				'aria-label': valueText(checked ? value() : index),
				'aria-disabled': Boolean(getProps().disabled) || undefined,
				'data-disabled': dataAttr(Boolean(getProps().disabled)),
				'data-readonly': dataAttr(Boolean(getProps().readOnly)),
				'aria-setsize': count(),
				'aria-checked': checked,
				'data-checked': dataAttr(state.checked),
				'aria-posinset': index,
				'data-highlighted': dataAttr(state.highlighted),
				'data-half': dataAttr(state.half)
			});
		},
		itemIndicatorAttrs(index) {
			const state = itemState(index);
			return dropUndefined({
				'data-half': dataAttr(state.half),
				'data-highlighted': dataAttr(state.highlighted)
			});
		},
		get value() {
			return value();
		},
		get hoveredValue() {
			return hoveredValue();
		},
		get count() {
			return count();
		},
		get items() {
			return Array.from({ length: count() }, (_, index) => index + 1);
		},
		get disabled() {
			return Boolean(getProps().disabled);
		},
		get readOnly() {
			return Boolean(getProps().readOnly);
		},
		get required() {
			return Boolean(getProps().required);
		},
		get dir() {
			return getProps().dir;
		},
		get rootId() {
			return rootId();
		},
		get labelId() {
			return labelId();
		},
		get controlId() {
			return controlId();
		},
		get hiddenInputId() {
			return hiddenInputId();
		}
	};
}
