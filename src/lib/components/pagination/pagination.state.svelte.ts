import { createContext } from '../../internal/context';
import { dataAttr } from '../../internal/dom';

export interface PaginationPageChangeDetails {
	page: number;
	pageSize: number;
}

export interface PaginationPageSizeChangeDetails {
	pageSize: number;
}

export interface PaginationPageUrlDetails {
	page: number;
	pageSize: number;
}

export interface PaginationItemLabelDetails {
	page: number;
	totalPages: number;
}

export interface PaginationTranslations {
	rootLabel?: string;
	firstTriggerLabel?: string;
	prevTriggerLabel?: string;
	nextTriggerLabel?: string;
	lastTriggerLabel?: string;
	itemLabel?: (details: PaginationItemLabelDetails) => string;
}

export interface UsePaginationProps {
	count?: number;
	page?: number;
	defaultPage?: number;
	pageSize?: number;
	defaultPageSize?: number;
	siblingCount?: number;
	boundaryCount?: number;
	type?: 'button' | 'link';
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	getPageUrl?: (details: PaginationPageUrlDetails) => string;
	onPageChange?: (details: PaginationPageChangeDetails) => void;
	onPageSizeChange?: (details: PaginationPageSizeChangeDetails) => void;
	translations?: PaginationTranslations;
}

export type PaginationPageItem = { type: 'page'; value: number };
export type PaginationEllipsisItem = { type: 'ellipsis' };
export type PaginationItem = PaginationPageItem | PaginationEllipsisItem;

export interface PaginationApi {
	readonly page: number;
	readonly pageSize: number;
	readonly count: number;
	readonly totalPages: number;
	readonly pages: PaginationItem[];
	readonly previousPage: number | null;
	readonly nextPage: number | null;
	readonly pageRange: { start: number; end: number };
	readonly type: 'button' | 'link';
	readonly dir: 'ltr' | 'rtl' | 'auto' | null | undefined;
	readonly rootId: string;
	itemId(page: number): string;
	ellipsisId(index: number): string;
	firstTriggerId: string;
	prevTriggerId: string;
	nextTriggerId: string;
	lastTriggerId: string;
	setPage(page: number): void;
	setPageSize(size: number): void;
	goToFirstPage(): void;
	goToPrevPage(): void;
	goToNextPage(): void;
	goToLastPage(): void;
	getPageUrl(page: number): string | undefined;
	rootAttrs(): Record<string, unknown>;
	itemAttrs(page: number): Record<string, unknown>;
	ellipsisAttrs(index: number): Record<string, unknown>;
	firstTriggerAttrs(): Record<string, unknown>;
	prevTriggerAttrs(): Record<string, unknown>;
	nextTriggerAttrs(): Record<string, unknown>;
	lastTriggerAttrs(): Record<string, unknown>;
}

const defaultTranslations = {
	rootLabel: 'pagination',
	firstTriggerLabel: 'first page',
	prevTriggerLabel: 'previous page',
	nextTriggerLabel: 'next page',
	lastTriggerLabel: 'last page',
	itemLabel: ({ page, totalPages }: PaginationItemLabelDetails) =>
		`${totalPages > 1 && page === totalPages ? 'last page, ' : ''}page ${page}`
};

function dropUndefined<T extends Record<string, unknown>>(value: T): T {
	return Object.fromEntries(
		Object.entries(value).filter(([, entry]) => entry !== undefined)
	) as T;
}

function range(start: number, end: number) {
	return Array.from({ length: end - start + 1 }, (_, index) => index + start);
}

function getRange(options: {
	page: number;
	totalPages: number;
	siblingCount: number;
	boundaryCount: number;
}): (number | 'ellipsis')[] {
	const { page, totalPages, siblingCount, boundaryCount } = options;
	if (totalPages <= 0) return [];
	if (totalPages === 1) return [1];

	const firstPageIndex = 1;
	const lastPageIndex = totalPages;
	const leftSiblingIndex = Math.max(page - siblingCount, firstPageIndex);
	const rightSiblingIndex = Math.min(page + siblingCount, lastPageIndex);
	const totalPageNumbers = Math.min(siblingCount * 2 + 3 + boundaryCount * 2, totalPages);

	if (totalPages <= totalPageNumbers) return range(firstPageIndex, lastPageIndex);

	const itemCount = totalPageNumbers - 1 - boundaryCount;
	const showLeftEllipsis =
		leftSiblingIndex > firstPageIndex + boundaryCount + 1 &&
		Math.abs(leftSiblingIndex - firstPageIndex) > boundaryCount + 1;
	const showRightEllipsis =
		rightSiblingIndex < lastPageIndex - boundaryCount - 1 &&
		Math.abs(lastPageIndex - rightSiblingIndex) > boundaryCount + 1;

	const pages: (number | 'ellipsis')[] = [];

	if (!showLeftEllipsis && showRightEllipsis) {
		pages.push(...range(1, itemCount), 'ellipsis');
		pages.push(...range(lastPageIndex - boundaryCount + 1, lastPageIndex));
	} else if (showLeftEllipsis && !showRightEllipsis) {
		pages.push(...range(firstPageIndex, firstPageIndex + boundaryCount - 1), 'ellipsis');
		pages.push(...range(lastPageIndex - itemCount + 1, lastPageIndex));
	} else if (showLeftEllipsis && showRightEllipsis) {
		pages.push(...range(firstPageIndex, firstPageIndex + boundaryCount - 1), 'ellipsis');
		pages.push(...range(leftSiblingIndex, rightSiblingIndex));
		pages.push('ellipsis');
		pages.push(...range(lastPageIndex - boundaryCount + 1, lastPageIndex));
	} else {
		pages.push(...range(firstPageIndex, lastPageIndex));
	}

	for (let index = 0; index < pages.length; index += 1) {
		if (pages[index] !== 'ellipsis') continue;
		const previous = typeof pages[index - 1] === 'number' ? (pages[index - 1] as number) : 0;
		const next =
			typeof pages[index + 1] === 'number' ? (pages[index + 1] as number) : totalPages + 1;
		if (next - previous === 2) pages[index] = previous + 1;
	}

	return pages;
}

const paginationContext = createContext<PaginationApi>('Pagination', 'Pagination.Root');
export const usePaginationContext = () => paginationContext.get();
export const setPaginationContext = (api: PaginationApi) => paginationContext.set(api);

export function createPagination(getProps: () => UsePaginationProps, uid: string): PaginationApi {
	const rootId = () => getProps().id ?? `pagination:${uid}`;
	const label = (key: Exclude<keyof PaginationTranslations, 'itemLabel'>) =>
		getProps().translations?.[key] ?? defaultTranslations[key];
	const itemLabel = (details: PaginationItemLabelDetails) =>
		getProps().translations?.itemLabel?.(details) ?? defaultTranslations.itemLabel(details);

	let internalPage = $state(getProps().defaultPage ?? 1);
	let internalPageSize = $state(getProps().defaultPageSize ?? 10);

	const page = () => getProps().page ?? internalPage;
	const pageSize = () => getProps().pageSize ?? internalPageSize;
	const count = () => getProps().count ?? 1;
	const totalPages = () => Math.ceil(count() / pageSize());
	const previousPage = () => (page() === 1 ? null : page() - 1);
	const nextPage = () => (page() === totalPages() ? null : page() + 1);

	function setPage(next: number) {
		if (next < 1 || next > totalPages()) return;
		if (getProps().page === undefined) internalPage = next;
		getProps().onPageChange?.({ page: next, pageSize: pageSize() });
	}

	function setPageSize(size: number) {
		if (getProps().pageSize === undefined) internalPageSize = size;
		getProps().onPageSizeChange?.({ pageSize: size });
		const total = Math.ceil(count() / size);
		if (page() > total) setPage(total);
	}

	const linkUrl = (target: number) =>
		getProps().getPageUrl?.({ page: target, pageSize: pageSize() });

	const linkProps = (targetPage: number | null, disabled: boolean) => {
		if (getProps().type !== 'link') return {};
		if (disabled || targetPage == null) return { role: 'link', 'aria-disabled': true };
		const url = linkUrl(targetPage);
		return url ? { href: url } : {};
	};

	const triggerAttrs = (
		kind: 'first' | 'prev' | 'next' | 'last',
		id: string,
		disabled: boolean,
		label: string,
		target: number | null,
		onClick: () => void
	) =>
		dropUndefined({
			id,
			dir: getProps().dir ?? undefined,
			'data-disabled': dataAttr(disabled),
			'aria-label': label,
			onclick: onClick,
			...getProps().type !== 'link' ? { disabled, type: 'button' as const } : {},
			...linkProps(target, disabled)
		});

	return {
		itemId: (target: number) => `${rootId()}:item:${target}`,
		ellipsisId: (index: number) => `${rootId()}:ellipsis:${index}`,
		setPage,
		setPageSize,
		goToFirstPage: () => setPage(1),
		goToPrevPage: () => {
			if (page() > 1) setPage(page() - 1);
		},
		goToNextPage: () => {
			if (page() < totalPages()) setPage(page() + 1);
		},
		goToLastPage: () => setPage(totalPages()),
		getPageUrl: (target: number) => linkUrl(target),
		rootAttrs: () =>
			dropUndefined({
				id: rootId(),
				dir: getProps().dir ?? undefined,
				'aria-label': label('rootLabel')
			}),
		itemAttrs: (target: number) => {
			const current = target === page();
			return dropUndefined({
				id: `${rootId()}:item:${target}`,
				dir: getProps().dir ?? undefined,
				'data-index': target,
				'data-selected': dataAttr(current),
				'aria-current': current ? 'page' : undefined,
				'aria-label': itemLabel({ page: target, totalPages: totalPages() }),
				onclick: () => setPage(target),
				...getProps().type === 'button' ? { type: 'button' as const } : {},
				...getProps().type === 'link' && linkUrl(target) ? { href: linkUrl(target) } : {}
			});
		},
		ellipsisAttrs: (index: number) =>
			dropUndefined({ id: `${rootId()}:ellipsis:${index}`, dir: getProps().dir ?? undefined }),
		firstTriggerAttrs: () =>
			triggerAttrs(
				'first',
				`${rootId()}:first`,
				page() === 1,
				label('firstTriggerLabel'),
				1,
				() => setPage(1)
			),
		prevTriggerAttrs: () =>
			triggerAttrs(
				'prev',
				`${rootId()}:prev`,
				page() === 1,
				label('prevTriggerLabel'),
				previousPage(),
				() => {
					if (page() > 1) setPage(page() - 1);
				}
			),
		nextTriggerAttrs: () =>
			triggerAttrs(
				'next',
				`${rootId()}:next`,
				page() >= totalPages(),
				label('nextTriggerLabel'),
				nextPage(),
				() => {
					if (page() < totalPages()) setPage(page() + 1);
				}
			),
		lastTriggerAttrs: () =>
			triggerAttrs(
				'last',
				`${rootId()}:last`,
				page() >= totalPages(),
				label('lastTriggerLabel'),
				totalPages(),
				() => setPage(totalPages())
			),
		get page() {
			return page();
		},
		get pageSize() {
			return pageSize();
		},
		get count() {
			return count();
		},
		get totalPages() {
			return totalPages();
		},
		get pages() {
			return getRange({
				page: page(),
				totalPages: totalPages(),
				siblingCount: getProps().siblingCount ?? 1,
				boundaryCount: getProps().boundaryCount ?? 1
			}).map((entry): PaginationItem =>
				entry === 'ellipsis' ? { type: 'ellipsis' } : { type: 'page', value: entry }
			);
		},
		get previousPage() {
			return previousPage();
		},
		get nextPage() {
			return nextPage();
		},
		get pageRange() {
			const start = (page() - 1) * pageSize();
			return { start, end: Math.min(start + pageSize(), count()) };
		},
		get type() {
			return getProps().type ?? 'button';
		},
		get dir() {
			return getProps().dir;
		},
		get rootId() {
			return rootId();
		},
		get firstTriggerId() {
			return `${rootId()}:first`;
		},
		get prevTriggerId() {
			return `${rootId()}:prev`;
		},
		get nextTriggerId() {
			return `${rootId()}:next`;
		},
		get lastTriggerId() {
			return `${rootId()}:last`;
		}
	};
}
