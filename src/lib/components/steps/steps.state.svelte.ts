import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';

export interface StepChangeDetails {
	step: number;
}

export interface StepInvalidDetails {
	index: number;
}

export interface UseStepsProps {
	count?: number;
	step?: number;
	defaultStep?: number;
	linear?: boolean;
	orientation?: 'horizontal' | 'vertical';
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	isStepValid?: (index: number) => boolean;
	isStepSkippable?: (index: number) => boolean;
	onStepChange?: (details: StepChangeDetails) => void;
	onStepComplete?: () => void;
	onStepInvalid?: (details: StepInvalidDetails) => void;
}

export interface StepsItemState {
	triggerId: string;
	contentId: string;
	current: boolean;
	completed: boolean;
	incomplete: boolean;
	index: number;
	first: boolean;
	last: boolean;
	skippable: boolean;
	isValid: () => boolean;
}

export interface StepsApi {
	readonly value: number;
	readonly count: number;
	readonly percent: number;
	readonly hasNextStep: boolean;
	readonly hasPrevStep: boolean;
	readonly isCompleted: boolean;
	readonly rootId: string;
	readonly listId: string;
	readonly orientation: 'horizontal' | 'vertical';
	readonly linear: boolean;
	itemState(index: number): StepsItemState;
	isStepValid(index: number): boolean;
	isStepSkippable(index: number): boolean;
	setStep(step: number): void;
	goToNextStep(): void;
	goToPrevStep(): void;
	resetStep(): void;
	rootAttrs(): Record<string, unknown>;
	listAttrs(): Record<string, unknown>;
	itemAttrs(index: number): Record<string, unknown>;
	triggerAttrs(index: number): Record<string, unknown>;
	indicatorAttrs(index: number): Record<string, unknown>;
	separatorAttrs(index: number): Record<string, unknown>;
	contentAttrs(index: number): Record<string, unknown>;
	nextTriggerAttrs(): Record<string, unknown>;
	prevTriggerAttrs(): Record<string, unknown>;
	progressAttrs(): Record<string, unknown>;
}

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	return Object.fromEntries(
		Object.entries(value).filter(([, entry]) => entry !== undefined)
	) as T;
}

const stepsContext = createContext<StepsApi>('Steps', 'Steps.Root');
export const useStepsContext = () => stepsContext.get();
export const setStepsContext = (api: StepsApi) => stepsContext.set(api);

const itemContext = createContext<() => StepsItemState>('Steps.Item', 'Steps.Item');
export const useStepsItemContext = () => itemContext.get()();
export const setStepsItemContext = (state: () => StepsItemState) => itemContext.set(state);

export function createSteps(getProps: () => UseStepsProps, uid: string): StepsApi {
	const rootId = () => getProps().id ?? `steps:${uid}`;
	const count = () => getProps().count ?? 1;
	const orientation = () => getProps().orientation ?? 'horizontal';
	const linear = () => getProps().linear ?? false;

	let internalStep = $state(getProps().defaultStep ?? 0);
	const step = () => getProps().step ?? internalStep;
	const percent = () => (step() / count()) * 100;

	const isStepValid = (index: number) => getProps().isStepValid?.(index) ?? true;
	const isStepSkippable = (index: number) => getProps().isStepSkippable?.(index) ?? false;

	function itemState(index: number): StepsItemState {
		return {
			triggerId: `${rootId()}:trigger:${index}`,
			contentId: `${rootId()}:content:${index}`,
			current: index === step(),
			completed: index < step(),
			incomplete: index > step(),
			index,
			first: index === 0,
			last: index === count() - 1,
			skippable: isStepSkippable(index),
			isValid: () => isStepValid(index)
		};
	}

	function setStep(next: number) {
		if (next < 0 || next > count()) return;
		if (!isStepValid(step())) {
			getProps().onStepInvalid?.({ index: step() });
			return;
		}
		if (getProps().step === undefined) internalStep = next;
		getProps().onStepChange?.({ step: next });
		if (next === count()) getProps().onStepComplete?.();
	}

	const stateAttrs = (index: number) => {
		const state = itemState(index);
		return dropUndefined({
			'data-complete': dataAttr(state.completed),
			'data-current': dataAttr(state.current),
			'data-incomplete': dataAttr(state.incomplete)
		});
	};

	return {
		itemState,
		isStepValid,
		isStepSkippable,
		setStep,
		goToNextStep: () => setStep(step() + 1),
		goToPrevStep: () => setStep(step() - 1),
		resetStep: () => setStep(0),
		rootAttrs: () =>
			dropUndefined({
				id: rootId(),
				dir: getProps().dir ?? undefined,
				'data-orientation': orientation(),
				style: `--percent: ${percent()}%`
			}),
		listAttrs: () => {
			const triggerIds = Array.from({ length: count() }, (_, index) => `${rootId()}:trigger:${index}`);
			return dropUndefined({
				id: `${rootId()}:list`,
				dir: getProps().dir ?? undefined,
				role: 'tablist',
				'aria-owns': triggerIds.join(' '),
				'aria-orientation': orientation(),
				'data-orientation': orientation()
			});
		},
		itemAttrs: (index: number) =>
			dropUndefined({
				dir: getProps().dir ?? undefined,
				'data-orientation': orientation(),
				'data-skippable': dataAttr(isStepSkippable(index)),
				...stateAttrs(index)
			}),
		triggerAttrs: (index: number) => {
			const state = itemState(index);
			return dropUndefined({
				id: state.triggerId,
				role: 'tab',
				type: 'button',
				dir: getProps().dir ?? undefined,
				tabindex: !linear() || state.current ? 0 : -1,
				'aria-selected': state.current,
				'aria-current': state.current ? 'step' : undefined,
				'aria-controls': state.contentId,
				'data-state': state.current ? 'open' : 'closed',
				'data-orientation': orientation(),
				...stateAttrs(index),
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					if (linear()) return;
					setStep(index);
				}
			});
		},
		indicatorAttrs: (index: number) =>
			dropUndefined({ dir: getProps().dir ?? undefined, 'aria-hidden': true, ...stateAttrs(index) }),
		separatorAttrs: (index: number) =>
			dropUndefined({
				dir: getProps().dir ?? undefined,
				'data-orientation': orientation(),
				...stateAttrs(index)
			}),
		contentAttrs: (index: number) => {
			const state = itemState(index);
			return dropUndefined({
				dir: getProps().dir ?? undefined,
				id: state.contentId,
				role: 'tabpanel',
				tabindex: 0,
				hidden: !state.current,
				'data-state': state.current ? 'open' : 'closed',
				'data-orientation': orientation(),
				'aria-labelledby': state.triggerId
			});
		},
		nextTriggerAttrs: () =>
			dropUndefined({
				dir: getProps().dir ?? undefined,
				type: 'button',
				disabled: !(step() < count()),
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					setStep(step() + 1);
				}
			}),
		prevTriggerAttrs: () =>
			dropUndefined({
				dir: getProps().dir ?? undefined,
				type: 'button',
				disabled: !(step() > 0),
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					setStep(step() - 1);
				}
			}),
		progressAttrs: () =>
			dropUndefined({
				dir: getProps().dir ?? undefined,
				role: 'progressbar',
				'aria-valuenow': percent(),
				'aria-valuemin': 0,
				'aria-valuemax': 100,
				'aria-valuetext': `${percent()}% complete`,
				'data-complete': dataAttr(percent() === 100)
			}),
		get value() {
			return step();
		},
		get count() {
			return count();
		},
		get percent() {
			return percent();
		},
		get hasNextStep() {
			return step() < count();
		},
		get hasPrevStep() {
			return step() > 0;
		},
		get isCompleted() {
			return step() === count();
		},
		get rootId() {
			return rootId();
		},
		get listId() {
			return `${rootId()}:list`;
		},
		get orientation() {
			return orientation();
		},
		get linear() {
			return linear();
		}
	};
}

const itemIndexContext = createContext<() => number>('Steps.ItemIndex', 'Steps.Item');
export const useStepsItemIndexContext = () => itemIndexContext.get();
export const setStepsItemIndexContext = (value: () => number) => itemIndexContext.set(value);
