import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';
import { useFieldContext } from '../field/field.state.svelte';

export interface TagsInputValueChangeDetails {
	value: string[];
}

export interface TagsInputInputValueChangeDetails {
	inputValue: string;
}

export interface TagsInputHighlightChangeDetails {
	highlightedValue: string | null;
}

export type TagsInputValidityReason = 'rangeOverflow' | 'invalidTag';

export interface TagsInputValidityChangeDetails {
	reason: TagsInputValidityReason;
}

export interface TagsInputValidateArgs {
	inputValue: string;
	value: string[];
}

export interface TagsInputTranslations {
	clearTriggerLabel: string;
	deleteTagTriggerLabel: (value: string) => string;
	tagAdded: (value: string) => string;
	tagsPasted: (values: string[]) => string;
	tagEdited: (value: string) => string;
	tagUpdated: (value: string) => string;
	tagDeleted: (value: string) => string;
	tagSelected: (value: string) => string;
	noTagsSelected: string;
	inputLabel: (count: number) => string;
}

export interface TagsInputItemOptions {
	index: number;
	value: string;
	disabled?: boolean;
}

export interface TagsInputItemState {
	id: string;
	value: string;
	index: number;
	editing: boolean;
	editedValue: string;
	highlighted: boolean;
	disabled: boolean;
}

export interface TagsInputElementIds {
	root?: string;
	input?: string;
	hiddenInput?: string;
	clearBtn?: string;
	label?: string;
	control?: string;
	item?: (options: TagsInputItemOptions) => string;
	itemDeleteTrigger?: (options: TagsInputItemOptions) => string;
	itemInput?: (options: TagsInputItemOptions) => string;
}

export type TagsInputBlurBehavior = 'clear' | 'add';

export interface UseTagsInputProps {
	value?: string[];
	defaultValue?: string[];
	inputValue?: string;
	defaultInputValue?: string;
	onValueChange?: (details: TagsInputValueChangeDetails) => void;
	onInputValueChange?: (details: TagsInputInputValueChangeDetails) => void;
	onHighlightChange?: (details: TagsInputHighlightChangeDetails) => void;
	onValueInvalid?: (details: TagsInputValidityChangeDetails) => void;
	validate?: (args: TagsInputValidateArgs) => boolean;
	sanitizeValue?: (value: string) => string;
	allowDuplicates?: boolean;
	allowOverflow?: boolean;
	addOnPaste?: boolean;
	blurBehavior?: TagsInputBlurBehavior;
	editable?: boolean;
	delimiter?: string | RegExp;
	max?: number;
	maxLength?: number;
	disabled?: boolean;
	readOnly?: boolean;
	invalid?: boolean;
	required?: boolean;
	name?: string;
	form?: string;
	placeholder?: string;
	autoFocus?: boolean;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: TagsInputElementIds;
	translations?: Partial<TagsInputTranslations>;
}

type Attrs = Record<string, unknown>;

export interface TagsInputApi {
	readonly value: string[];
	readonly inputValue: string;
	readonly valueAsString: string;
	readonly count: number;
	readonly empty: boolean;
	readonly atMax: boolean;
	readonly disabled: boolean;
	readonly readOnly: boolean;
	readonly invalid: boolean;
	readonly required: boolean;
	readonly dir: 'ltr' | 'rtl' | 'auto' | undefined;
	readonly placeholder: string | undefined;
	readonly translations: TagsInputTranslations;
	readonly rootId: string;
	readonly inputId: string;
	readonly hiddenInputId: string;
	readonly labelId: string;
	readonly controlId: string;
	readonly clearTriggerId: string;
	itemId(options: TagsInputItemOptions): string;
	itemDeleteTriggerId(options: TagsInputItemOptions): string;
	itemInputId(options: TagsInputItemOptions): string;
	itemState(options: TagsInputItemOptions): TagsInputItemState;
	rootAttrs(): Attrs;
	labelAttrs(): Attrs;
	controlAttrs(): Attrs;
	inputAttrs(): Attrs;
	hiddenInputAttrs(): Attrs;
	itemAttrs(options: TagsInputItemOptions): Attrs;
	itemPreviewAttrs(options: TagsInputItemOptions): Attrs;
	itemTextAttrs(options: TagsInputItemOptions): Attrs;
	itemInputAttrs(options: TagsInputItemOptions): Attrs;
	itemDeleteTriggerAttrs(options: TagsInputItemOptions): Attrs;
	clearTriggerAttrs(): Attrs;
	setValue(value: string[]): void;
	clearValue(id?: string): void;
	addValue(value: string): void;
	setValueAtIndex(index: number, value: string): void;
	setInputValue(value: string): void;
	clearInputValue(): void;
	focus(): void;
	registerRoot(node: Element | null): void;
	registerInput(node: Element | null): void;
	registerHiddenInput(node: Element | null): void;
}

const defaultTranslations: TagsInputTranslations = {
	clearTriggerLabel: 'Clear all tags',
	deleteTagTriggerLabel: (value) => `Delete tag ${value}`,
	tagAdded: (value) => `Added tag ${value}`,
	tagsPasted: (values) => `Pasted ${values.length} tags`,
	tagEdited: (value) => `Editing tag ${value}. Press enter to save or escape to cancel.`,
	tagUpdated: (value) => `Tag update to ${value}`,
	tagDeleted: (value) => `Tag ${value} deleted`,
	tagSelected: (value) => `Tag ${value} selected. Press enter to edit, delete or backspace to remove.`,
	noTagsSelected: 'No tags selected',
	inputLabel: (count) => (count === 1 ? '1 tag' : `${count} tags`)
};

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	const result: Record<string, unknown> = {};
	for (const [key, entry] of Object.entries(value)) {
		if (entry !== undefined) result[key] = entry;
	}
	return result as T;
}

function uniq(values: string[]): string[] {
	return Array.from(new Set(values));
}

function removeAt<T>(values: T[], index: number): T[] {
	return values.filter((_, position) => position !== index);
}

function trimTrailingDelimiter(value: string, delimiter: string | RegExp): string | undefined {
	if (typeof delimiter === 'string') {
		if (!delimiter) return undefined;
		const index = value.lastIndexOf(delimiter);
		if (index === -1 || index + delimiter.length !== value.length) return undefined;
		return value.slice(0, index);
	}

	const flags = delimiter.flags.includes('g') ? delimiter.flags : `${delimiter.flags}g`;
	const matcher = new RegExp(delimiter.source, flags);
	let trailing: RegExpExecArray | null = null;
	for (let match = matcher.exec(value); match; match = matcher.exec(value)) {
		if (match[0].length === 0) {
			matcher.lastIndex += 1;
			continue;
		}
		if (match.index + match[0].length === value.length) trailing = match;
	}
	return trailing ? value.slice(0, trailing.index) : undefined;
}

const tagsInputContext = createContext<TagsInputApi>('TagsInput', 'TagsInput');
const tagsInputItemContext =
	createContext<() => TagsInputItemOptions>('TagsInputItem', 'TagsInput.Item');

export const setTagsInputContext = (api: TagsInputApi): TagsInputApi => tagsInputContext.set(api);
export const useTagsInputContext = (): TagsInputApi => tagsInputContext.get();
export const setTagsInputItemContext = (
	options: () => TagsInputItemOptions
): (() => TagsInputItemOptions) => tagsInputItemContext.set(options);
export const useTagsInputItemContext = (): (() => TagsInputItemOptions) =>
	tagsInputItemContext.get();

type TagsInputState = 'idle' | 'focused:input' | 'navigating:tag' | 'editing:tag';

export function createTagsInput(props: () => UseTagsInputProps, uid: string): TagsInputApi {
	const field = useFieldContext();

	const prop = <K extends keyof UseTagsInputProps>(key: K): UseTagsInputProps[K] => props()[key];
	const disabled = () => Boolean(prop('disabled') ?? field?.disabled);
	const readOnly = () => Boolean(prop('readOnly') ?? field?.readOnly);
	const required = () => Boolean(prop('required') ?? field?.required);
	const editable = () => prop('editable') !== false;
	const allowDuplicates = () => Boolean(prop('allowDuplicates'));
	const allowOverflow = () => Boolean(prop('allowOverflow'));
	const interactive = () => !readOnly() && !disabled();
	const delimiter = () => prop('delimiter') ?? ',';
	const max = () => prop('max') ?? Number.MAX_VALUE;
	const sanitize = () => prop('sanitizeValue') ?? ((value: string) => value.trim());
	const validate = () => prop('validate') ?? (() => true);
	const translations = () => ({ ...defaultTranslations, ...prop('translations') });

	const rootId = () => prop('ids')?.root ?? prop('id') ?? `tags-input:${uid}`;
	const inputId = () => prop('ids')?.input ?? `${rootId()}:input`;
	const labelId = () => prop('ids')?.label ?? field?.ids.label ?? `${rootId()}:label`;
	const controlId = () => prop('ids')?.control ?? `${rootId()}:control`;
	const hiddenInputId = () =>
		prop('ids')?.hiddenInput ?? field?.ids.control ?? `${rootId()}:hidden-input`;
	const clearTriggerId = () => prop('ids')?.clearBtn ?? `${rootId()}:clear-btn`;

	const itemId = (options: TagsInputItemOptions) =>
		prop('ids')?.item?.(options) ?? `${rootId()}:tag:${options.value}:${options.index}`;
	const itemDeleteTriggerId = (options: TagsInputItemOptions) =>
		prop('ids')?.itemDeleteTrigger?.(options) ?? `${itemId(options)}:delete-btn`;
	const itemInputId = (options: TagsInputItemOptions) =>
		prop('ids')?.itemInput?.(options) ?? `${itemId(options)}:input`;

	let internalValue = $state<string[]>(prop('defaultValue') ?? prop('value') ?? []);
	let internalInputValue = $state<string>(prop('defaultInputValue') ?? prop('inputValue') ?? '');
	let phase = $state<TagsInputState>(prop('autoFocus') ? 'focused:input' : 'idle');
	let highlightedTagId = $state<string | null>(null);
	let editedTagId = $state<string | null>(null);
	let editedTagIndex = $state<number | null>(null);
	let editedTagValue = $state('');
	let dispatchedValueAsString: string | null = null;

	let rootNode = $state<Element | null>(null);
	let inputNode = $state<Element | null>(null);
	let hiddenInputNode = $state<Element | null>(null);

	const inputEl = () => inputNode as HTMLInputElement | null;
	const hiddenInputEl = () => hiddenInputNode as HTMLInputElement | null;


	const value = () => prop('value') ?? internalValue;
	const inputValue = () => prop('inputValue') ?? internalInputValue;
	const valueAsString = () => value().join(', ');
	const count = () => value().length;
	const empty = () => count() === 0;
	const atMax = () => count() === max();
	const overflowing = () => count() > max();
	const invalid = () => Boolean(prop('invalid') ?? field?.invalid) || overflowing();
	const focused = () => phase !== 'idle';
	const editing = () => phase === 'editing:tag';

	$effect(() => {
		const node = inputEl();
		const next = inputValue();
		if (node && node.value !== next) node.value = next;
	});

	$effect(() => {
		const node = hiddenInputEl();
		const next = valueAsString();
		if (node && node.value !== next) node.value = next;
		if (dispatchedValueAsString === null) {
			dispatchedValueAsString = next;
			return;
		}
		if (next === dispatchedValueAsString) return;
		dispatchedValueAsString = next;
		const target = hiddenInputEl();
		if (!target) return;
		queueMicrotask(() => target.dispatchEvent(new Event('input', { bubbles: true })));
	});

	$effect(() => {
		if (!prop('autoFocus')) return;
		focusInput();
	});

	$effect(() => {
		if (overflowing()) notifyInvalid('rangeOverflow');
	});

	function notifyValueChange(next: string[]) {
		prop('onValueChange')?.({ value: next });
	}

	function commitValue(next: string[]) {
		if (prop('value') === undefined) internalValue = next;
		notifyValueChange(next);
	}

	function setInputValue(next: string) {
		if (prop('inputValue') === undefined) internalInputValue = next;
		prop('onInputValueChange')?.({ inputValue: next });
	}

	function clearInputValue() {
		setInputValue('');
	}

	function setHighlighted(next: string | null) {
		if (highlightedTagId === next) return;
		highlightedTagId = next;
		prop('onHighlightChange')?.({ highlightedValue: next });
	}

	function notifyInvalid(reason: TagsInputValidityReason) {
		prop('onValueInvalid')?.({ reason });
	}

	function getTagElements(): HTMLElement[] {
		const node = rootNode;
		if (!node) return [];
		return Array.from(
			node.querySelectorAll<HTMLElement>('[data-part="item-preview"]:not([data-disabled])')
		);
	}

	function itemPreviewOf(target: Element | null): HTMLElement | null {
		return target?.closest<HTMLElement>('[data-part="item-preview"]') ?? null;
	}

	function setHoverIntent(target: Element | null) {
		const preview = itemPreviewOf(target);
		if (preview) preview.dataset.deleteIntent = '';
	}

	function clearHoverIntent(target: Element | null) {
		const preview = itemPreviewOf(target);
		if (preview) delete preview.dataset.deleteIntent;
	}

	function indexOfHighlighted() {
		const id = highlightedTagId;
		if (id == null) return -1;
		return getTagElements().findIndex((element) => element.id === id);
	}

	function highlightIdAt(index: number, list = value()): string | null {
		if (!list.length) return null;
		const clamped = Math.min(Math.max(index, 0), list.length - 1);
		return itemId({ value: list[clamped], index: clamped });
	}

	function highlightFirstTag() {
		setHighlighted(highlightIdAt(0));
	}

	function highlightLastTag() {
		setHighlighted(highlightIdAt(value().length - 1));
	}

	function highlightNextTag() {
		const index = indexOfHighlighted();
		if (index === -1) return;
		setHighlighted(highlightIdAt(index + 1));
	}

	function highlightPrevTag() {
		const index = indexOfHighlighted();
		if (index <= 0) {
			if (index === 0) setHighlighted(null);
			return;
		}
		setHighlighted(highlightIdAt(index - 1));
	}

	function focusInput() {
		inputEl()?.focus();
	}

	function isCaretAtStart() {
		const node = inputEl();
		if (!node) return true;
		return node.selectionStart === 0 && node.selectionEnd === 0;
	}

	function itemState(options: TagsInputItemOptions): TagsInputItemState {
		const id = itemId(options);
		return {
			id,
			value: options.value,
			index: options.index,
			editing: editing() && editedTagId === id,
			editedValue: editing() && editedTagId === id ? editedTagValue : '',
			highlighted: id === highlightedTagId,
			disabled: Boolean(options.disabled || disabled())
		};
	}

	function addTag(nextValue?: string) {
		const input = nextValue ?? sanitize()(inputValue());
		const current = value();
		if (validate()({ inputValue: input, value: [...current] })) {
			const appended = current.concat(input);
			commitValue(allowDuplicates() ? appended : uniq(appended));
		} else {
			notifyInvalid('invalidTag');
		}
	}

	function insertTag() {
		const sanitized = sanitize()(inputValue());
		if ((atMax() && !allowOverflow()) || sanitized.length === 0) return;
		addTag();
		clearInputValue();
	}

	function addTagFromPaste() {
		const current = inputValue();
		if (validate()({ inputValue: current, value: [...value()] })) {
			const split = delimiter() ? current.split(delimiter()) : [current];
			const pasted = split.map(sanitize());
			const appended = value().concat(pasted);
			commitValue(allowDuplicates() ? appended : uniq(appended));
		} else {
			notifyInvalid('invalidTag');
		}
		clearInputValue();
	}

	function deleteTag(id: string) {
		const index = getTagElements().findIndex((element) => element.id === id);
		if (index === -1) return;
		commitValue(removeAt(value(), index));
	}

	function deleteHighlightedTag(): number {
		const index = indexOfHighlighted();
		if (index === -1) return -1;
		commitValue(removeAt(value(), index));
		return index;
	}

	function enterFocusedInput() {
		phase = 'focused:input';
		setHighlighted(null);
		focusInput();
	}

	function enterNavigatingTag() {
		phase = 'navigating:tag';
	}

	function startEditing() {
		const id = highlightedTagId;
		if (id == null) return;
		const index = indexOfHighlighted();
		editedTagId = id;
		editedTagIndex = index;
		editedTagValue = value()[index] ?? '';
		phase = 'editing:tag';
	}

	function clearEditing() {
		editedTagId = null;
		editedTagValue = '';
	}

	function finishEditing(target: TagsInputState) {
		const index = editedTagIndex;
		editedTagId = null;
		editedTagValue = '';
		phase = target;
		if (target === 'navigating:tag') setHighlighted(highlightIdAt(index ?? -1));
	}

	function submitEditedTagValue() {
		const index = editedTagIndex;
		if (index == null) return;
		const next = editedTagValue;
		const current = value();
		if (current.some((item, position) => position !== index && item === next)) {
			if (!allowDuplicates()) return;
		}
		if (current[index] === next) return;
		commitValue(current.map((item, position) => (position === index ? next : item)));
	}

	function setValueAtIndex(index: number, next: string) {
		if (!next) return;
		const current = value();
		if (!allowDuplicates() && current.some((item, position) => position !== index && item === next))
			return;
		if (current[index] === next) return;
		commitValue(current.map((item, position) => (position === index ? next : item)));
	}

	function pointerDownRoot() {
		if (!interactive()) return;
		if (phase === 'idle' && highlightedTagId == null) enterFocusedInput();
	}

	function pointerDownTag(id: string) {
		if (!interactive()) return;
		phase = 'navigating:tag';
		setHighlighted(id);
		focusInput();
	}

	function doubleClickTag(id: string) {
		if (!interactive() || !editable()) return;
		setHighlighted(highlightedTagId ?? id);
		startEditing();
	}

	function clickDeleteTag(id: string) {
		if (!interactive()) return;
		phase = 'focused:input';
		deleteTag(id);
		setHighlighted(null);
		focusInput();
	}

	function handleFocus() {
		if (phase !== 'idle') return;
		enterFocusedInput();
	}

	function handleBlur(event: FocusEvent) {
		const related = event.relatedTarget as Node | null;
		if (related && rootNode?.contains(related)) return;
		if (phase === 'idle') return;
		const wasTyping = phase === 'focused:input';
		phase = 'idle';
		setHighlighted(null);
		if (!wasTyping) return;
		const behavior = prop('blurBehavior');
		if (behavior === 'add') insertTag();
		else if (behavior === 'clear') clearInputValue();
	}

	function handleInput(event: Event) {
		const node = event.currentTarget as HTMLInputElement;
		const next = node.value;
		if (phase === 'navigating:tag') {
			phase = 'focused:input';
			setHighlighted(null);
		}
		if ((event as InputEvent).inputType === 'insertFromPaste') {
			if (prop('addOnPaste')) {
				setInputValue(next);
				addTagFromPaste();
			} else {
				setInputValue(next);
			}
			return;
		}
		const beforeDelimiter = trimTrailingDelimiter(next, delimiter());
		if (beforeDelimiter != null) {
			setInputValue(beforeDelimiter);
			insertTag();
			return;
		}
		setInputValue(next);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.defaultPrevented || event.isComposing) return;
		const key =
			prop('dir') === 'rtl' && event.key === 'ArrowLeft'
				? 'ArrowRight'
				: prop('dir') === 'rtl' && event.key === 'ArrowRight'
					? 'ArrowLeft'
					: event.key;

		switch (key) {
			case 'ArrowDown':
				if (phase === 'navigating:tag') enterFocusedInput();
				return;
			case 'ArrowLeft':
				arrowLeft();
				return;
			case 'ArrowRight':
				if (highlightedTagId) event.preventDefault();
				arrowRight();
				return;
			case 'Escape':
				event.preventDefault();
				if (phase === 'navigating:tag') enterFocusedInput();
				return;
			case 'Backspace':
				backspace();
				return;
			case 'Delete':
				deleteKey();
				return;
			case 'Enter':
				enterKey();
				event.preventDefault();
				return;
		}
	}

	function arrowLeft() {
		if (phase === 'focused:input') {
			if (value().length > 0 && isCaretAtStart()) {
				enterNavigatingTag();
				highlightLastTag();
			}
			return;
		}
		if (phase !== 'navigating:tag') return;
		if (!isCaretAtStart()) {
			enterFocusedInput();
			return;
		}
		highlightPrevTag();
	}

	function arrowRight() {
		if (phase !== 'navigating:tag') return;
		const elements = getTagElements();
		if (isCaretAtStart() && indexOfHighlighted() !== elements.length - 1) {
			highlightNextTag();
			return;
		}
		enterFocusedInput();
	}

	function backspace() {
		if (phase === 'focused:input') {
			if (value().length > 0 && isCaretAtStart()) {
				enterNavigatingTag();
				highlightLastTag();
			}
			return;
		}
		if (phase !== 'navigating:tag') return;
		if (!isCaretAtStart()) {
			enterFocusedInput();
			return;
		}
		const index = indexOfHighlighted();
		if (index === -1) {
			highlightLastTag();
			return;
		}
		const next = removeAt(value(), index);
		commitValue(next);
		setHighlighted(highlightIdAt(index - 1 < 0 ? 0 : index - 1, next));
	}

	function deleteKey() {
		if (phase !== 'navigating:tag') return;
		if (!isCaretAtStart()) {
			enterFocusedInput();
			return;
		}
		const index = deleteHighlightedTag();
		enterFocusedInput();
		if (index !== -1) setHighlighted(highlightIdAt(index));
	}

	function enterKey() {
		if (phase === 'focused:input') {
			insertTag();
			return;
		}
		if (phase === 'navigating:tag' && editable() && highlightedTagId != null) startEditing();
	}

	function handleItemInput(event: Event) {
		editedTagValue = (event.currentTarget as HTMLInputElement).value;
	}

	function handleItemKeyDown(event: KeyboardEvent) {
		if (event.defaultPrevented || event.isComposing) return;
		if (event.key === 'Enter') {
			event.preventDefault();
			if (sanitize()(editedTagValue) === '') {
				deleteHighlightedTag();
				clearEditing();
				phase = 'navigating:tag';
				focusInput();
				setHighlighted(highlightIdAt(editedTagIndex ?? -1));
				editedTagIndex = null;
				return;
			}
			submitEditedTagValue();
			finishEditing('navigating:tag');
			focusInput();
			editedTagIndex = null;
			return;
		}
		if (event.key === 'Escape') {
			event.preventDefault();
			finishEditing('navigating:tag');
			focusInput();
			editedTagIndex = null;
		}
	}

	function handleItemBlur(event: FocusEvent) {
		queueMicrotask(() => {
			if (!editing()) return;
			const related = event.relatedTarget as Node | null;
			if (related === inputNode) {
				finishEditing('navigating:tag');
				setHighlighted(null);
				editedTagIndex = null;
				return;
			}
			phase = 'idle';
			setHighlighted(null);
			clearEditing();
			editedTagIndex = null;
			const behavior = prop('blurBehavior');
			if (behavior === 'add') insertTag();
			else if (behavior === 'clear') clearInputValue();
		});
	}

	return {
		get value() {
			return value();
		},
		get inputValue() {
			return inputValue();
		},
		get valueAsString() {
			return valueAsString();
		},
		get count() {
			return count();
		},
		get empty() {
			return empty();
		},
		get atMax() {
			return atMax();
		},
		get disabled() {
			return disabled();
		},
		get readOnly() {
			return readOnly();
		},
		get invalid() {
			return invalid();
		},
		get required() {
			return required();
		},
		get dir() {
			return prop('dir') ?? undefined;
		},
		get placeholder() {
			return empty() ? prop('placeholder') : undefined;
		},
		get translations() {
			return translations();
		},
		get rootId() {
			return rootId();
		},
		get inputId() {
			return inputId();
		},
		get hiddenInputId() {
			return hiddenInputId();
		},
		get labelId() {
			return labelId();
		},
		get controlId() {
			return controlId();
		},
		get clearTriggerId() {
			return clearTriggerId();
		},
		itemId,
		itemDeleteTriggerId,
		itemInputId,
		itemState,
		setValue(next) {
			commitValue(next);
		},
		clearValue(id) {
			if (id) {
				deleteTag(id);
				return;
			}
			commitValue([]);
			clearInputValue();
			focusInput();
		},
		addValue(next) {
			addTag(next);
		},
		setValueAtIndex,
		setInputValue,
		clearInputValue,
		focus() {
			focusInput();
		},
		registerRoot(node) {
			rootNode = node;
		},
		registerInput(node) {
			inputNode = node;
		},
		registerHiddenInput(node) {
			hiddenInputNode = node;
		},
		rootAttrs() {
			return dropUndefined({
				id: rootId(),
				dir: prop('dir') ?? undefined,
				'data-invalid': dataAttr(invalid()),
				'data-readonly': dataAttr(readOnly()),
				'data-disabled': dataAttr(disabled()),
				'data-focus': dataAttr(focused()),
				'data-empty': dataAttr(empty()),
				onpointerdown: pointerDownRoot
			});
		},
		labelAttrs() {
			return dropUndefined({
				id: labelId(),
				dir: prop('dir') ?? undefined,
				for: inputId(),
				'data-disabled': dataAttr(disabled()),
				'data-invalid': dataAttr(invalid()),
				'data-readonly': dataAttr(readOnly()),
				'data-required': dataAttr(required())
			});
		},
		controlAttrs() {
			return dropUndefined({
				id: controlId(),
				dir: prop('dir') ?? undefined,
				tabindex: readOnly() ? 0 : undefined,
				'data-disabled': dataAttr(disabled()),
				'data-readonly': dataAttr(readOnly()),
				'data-invalid': dataAttr(invalid()),
				'data-focus': dataAttr(focused())
			});
		},
		inputAttrs() {
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				id: inputId(),
				'data-invalid': dataAttr(invalid()),
				'aria-invalid': invalid() || undefined,
				'data-readonly': dataAttr(readOnly()),
				'data-empty': dataAttr(empty()),
				maxlength: prop('maxLength'),
				autocomplete: 'off',
				autocorrect: 'off',
				autocapitalize: 'none',
				enterkeyhint: 'done',
				disabled: disabled() || readOnly(),
				placeholder: empty() ? prop('placeholder') : undefined,
				'aria-describedby': field?.ariaDescribedby,
				oninput: handleInput,
				onfocus: handleFocus,
				onblur: handleBlur,
				onkeydown: handleKeyDown
			});
		},
		hiddenInputAttrs() {
			return dropUndefined({
				id: hiddenInputId(),
				type: 'text',
				hidden: true,
				name: prop('name'),
				form: prop('form'),
				disabled: disabled(),
				readonly: readOnly(),
				required: required(),
				defaultValue: valueAsString()
			});
		},
		itemAttrs(options) {
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				'data-value': options.value,
				'data-disabled': dataAttr(disabled())
			});
		},
		itemPreviewAttrs(options) {
			const state = itemState(options);
			return dropUndefined({
				id: state.id,
				dir: prop('dir') ?? undefined,
				hidden: state.editing,
				'data-value': options.value,
				'data-disabled': dataAttr(disabled()),
				'data-highlighted': dataAttr(state.highlighted),
				onpointerdown(event: PointerEvent) {
					if (!interactive() || state.disabled) return;
					if (event.button !== 0) return;
					event.preventDefault();
					pointerDownTag(state.id);
				},
				ondblclick() {
					if (!interactive() || state.disabled) return;
					doubleClickTag(state.id);
				}
			});
		},
		itemTextAttrs(options) {
			const state = itemState(options);
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				'data-disabled': dataAttr(disabled()),
				'data-highlighted': dataAttr(state.highlighted)
			});
		},
		itemInputAttrs(options) {
			const state = itemState(options);
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				'aria-label': translations().tagEdited(options.value),
				disabled: disabled(),
				id: itemInputId(options),
				tabindex: -1,
				hidden: !state.editing,
				maxlength: prop('maxLength'),
				oninput: handleItemInput,
				onblur: handleItemBlur,
				onkeydown: handleItemKeyDown
			});
		},
		itemDeleteTriggerAttrs(options) {
			const state = itemState(options);
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				id: itemDeleteTriggerId(options),
				type: 'button',
				'data-disabled': dataAttr(state.disabled),
				'aria-disabled': state.disabled || undefined,
				'data-highlighted': dataAttr(state.highlighted),
				disabled: state.disabled,
				'aria-label': translations().deleteTagTriggerLabel(options.value),
				tabindex: -1,
				onpointerdown(event: PointerEvent) {
					if (event.button !== 0) return;
					if (!interactive()) event.preventDefault();
				},
				onpointermove(event: PointerEvent) {
					if (!interactive()) return;
					setHoverIntent(event.currentTarget as Element);
				},
				onpointerleave(event: PointerEvent) {
					if (!interactive()) return;
					clearHoverIntent(event.currentTarget as Element);
				},
				onclick(event: MouseEvent) {
					if (event.defaultPrevented) return;
					if (!interactive()) return;
					clickDeleteTag(state.id);
				}
			});
		},
		clearTriggerAttrs() {
			return dropUndefined({
				dir: prop('dir') ?? undefined,
				id: clearTriggerId(),
				type: 'button',
				'data-readonly': dataAttr(readOnly()),
				disabled: disabled(),
				'aria-label': translations().clearTriggerLabel,
				hidden: empty(),
				onclick() {
					if (!interactive()) return;
					commitValue([]);
					clearInputValue();
					focusInput();
				}
			});
		}
	};
}
