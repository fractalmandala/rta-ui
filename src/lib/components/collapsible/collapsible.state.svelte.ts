import { createContext } from '../../internal/context';

export interface CollapsibleOpenChangeDetails {
	open: boolean;
}

export interface UseCollapsibleProps {
	/** Controlled open state. Leave undefined for uncontrolled usage. */
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (details: CollapsibleOpenChangeDetails) => void;
	onExitComplete?: () => void;
	disabled?: boolean;
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	/** Height the content collapses to instead of 0, for a partially visible panel. */
	collapsedHeight?: number;
	collapsedWidth?: number;
	ids?: {
		root?: string;
		trigger?: string;
		content?: string;
	};
	id?: string | null;
}

export interface CollapsibleApi {
	readonly id: string;
	readonly open: boolean;
	readonly disabled: boolean;
	readonly dir: 'ltr' | 'rtl' | 'auto' | null | undefined;
	readonly collapsedHeight: number | undefined;
	readonly collapsedWidth: number | undefined;
	readonly rootId: string;
	readonly triggerId: string;
	readonly contentId: string;
	setOpen(open: boolean): void;
	toggle(): void;
}

const collapsibleContext = createContext<CollapsibleApi>('Collapsible', 'Collapsible.Root');

export const useCollapsibleContext = () => collapsibleContext.get();
export const setCollapsibleContext = (api: CollapsibleApi) => collapsibleContext.set(api);

export function createCollapsible(getProps: () => UseCollapsibleProps, uid: string): CollapsibleApi {
	const id = getProps().id ?? uid;
	const rootId = getProps().ids?.root ?? `collapsible:${id}`;
	const triggerId = getProps().ids?.trigger ?? `collapsible:${id}:trigger`;
	const contentId = getProps().ids?.content ?? `collapsible:${id}:content`;

	let internalOpen = $state(Boolean(getProps().open ?? getProps().defaultOpen));

	function isControlled() {
		return getProps().open !== undefined;
	}

	function isOpen() {
		return isControlled() ? Boolean(getProps().open) : internalOpen;
	}

	function setOpen(open: boolean) {
		if (open === isOpen()) return;
		if (!isControlled()) internalOpen = open;
		getProps().onOpenChange?.({ open });
	}

	return {
		id,
		rootId,
		triggerId,
		contentId,
		get open() {
			return isOpen();
		},
		get disabled() {
			return Boolean(getProps().disabled);
		},
		get dir() {
			return getProps().dir;
		},
		get collapsedHeight() {
			return getProps().collapsedHeight;
		},
		get collapsedWidth() {
			return getProps().collapsedWidth;
		},
		setOpen,
		toggle() {
			setOpen(!isOpen());
		}
	};
}
