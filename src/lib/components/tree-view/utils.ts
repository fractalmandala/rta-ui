// Small array helpers the tree machine needs. Zag spreads them from @zag-js/utils; they live here
// so the family keeps zero dependencies.

export function uniq<T>(values: T[]): T[] {
	return Array.from(new Set(values));
}

export function addAll<T>(values: T[], ...items: T[]): T[] {
	return uniq([...values, ...items]);
}

export function removeAll<T>(values: T[], ...items: T[]): T[] {
	const remove = new Set(items);
	return values.filter((value) => !remove.has(value));
}

export function diff<T>(values: T[], against: T[]): T[] {
	const existing = new Set(against);
	return values.filter((value) => !existing.has(value));
}

export function partition<T>(values: T[], predicate: (value: T) => boolean): [T[], T[]] {
	const pass: T[] = [];
	const fail: T[] = [];
	for (const value of values) (predicate(value) ? pass : fail).push(value);
	return [pass, fail];
}

export function sameArray(a: string[], b: string[]): boolean {
	if (a.length !== b.length) return false;
	return a.every((value, index) => value === b[index]);
}
