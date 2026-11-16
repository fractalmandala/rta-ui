export interface HighlightChunk {
	text: string;
	match: boolean;
}

export interface UseHighlightProps {
	query: string | string[];
	text: string;
	ignoreCase?: boolean;
	matchAll?: boolean;
	exactMatch?: boolean;
}

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const wholeWord = (value: string) => `\\b${value}\\b`;

function normalizeSpan(spans: { start: number; end: number }[], textLength: number) {
	const result: { start: number; end: number; match?: boolean }[] = [];
	let cursor = 0;
	for (const span of spans) {
		if (span.start > cursor) result.push({ start: cursor, end: span.start });
		result.push({ start: span.start, end: span.end, match: true });
		cursor = span.end;
	}
	if (cursor < textLength) result.push({ start: cursor, end: textLength });
	return result;
}

function highlightFirst(props: UseHighlightProps): HighlightChunk[] {
	const { exactMatch, ignoreCase, query, text } = props;
	if (exactMatch) {
		const pattern = new RegExp(wholeWord(escapeRegex(query as string)), ignoreCase ? 'iu' : 'u');
		const match = text.match(pattern);
		if (!match || match.index === undefined) return [{ text, match: false }];
		const start = match.index;
		return normalizeSpan([{ start, end: start + match[0].length }], text.length).map((chunk) => ({
			text: text.slice(chunk.start, chunk.end),
			match: Boolean(chunk.match)
		}));
	}
	const haystack = ignoreCase ? text.toLowerCase() : text;
	const needle = ignoreCase ? (query as string).toLowerCase() : (query as string);
	const start = haystack.indexOf(needle);
	if (start === -1) return [{ text, match: false }];
	return normalizeSpan([{ start, end: start + needle.length }], text.length).map((chunk) => ({
		text: text.slice(chunk.start, chunk.end),
		match: Boolean(chunk.match)
	}));
}

function highlightMultiple(props: UseHighlightProps, matchAll: boolean): HighlightChunk[] {
	const { exactMatch, ignoreCase, query, text } = props;
	const queries = (Array.isArray(query) ? query : [query]).filter(Boolean);
	if (queries.length === 0) return [{ text, match: false }];
	const pattern = queries.map(escapeRegex).join('|');
	const source = exactMatch ? wholeWord(pattern) : `(${pattern})`;
	const flags = `${ignoreCase ? 'i' : ''}${matchAll ? 'g' : ''}u`;
	const regex = new RegExp(source, flags);
	const spans = [...text.matchAll(regex)].map((match) => ({
		start: match.index ?? 0,
		end: (match.index ?? 0) + match[0].length
	}));
	if (spans.length === 0) return [{ text, match: false }];
	return normalizeSpan(spans, text.length).map((chunk) => ({
		text: text.slice(chunk.start, chunk.end),
		match: Boolean(chunk.match)
	}));
}

export function highlightWord(props: UseHighlightProps): HighlightChunk[] {
	const matchAll = props.matchAll ?? Array.isArray(props.query);
	if (!matchAll && Array.isArray(props.query)) {
		throw new Error('matchAll must be true when using multiple queries');
	}
	return matchAll ? highlightMultiple(props, matchAll) : highlightFirst(props);
}
