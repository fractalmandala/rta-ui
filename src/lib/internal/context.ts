import { getContext, setContext } from 'svelte';

export interface Context<T> {
	/** Provide the value to descendants. */
	set: (value: T) => T;
	/** Provide a value, or return the current one when called with no argument. */
	use: () => T | undefined;
	/** Read the value, throwing when used outside its provider. */
	get: () => T;
}

export function createContext<T>(name: string, provider: string): Context<T> {
	const key = Symbol(name);

	return {
		set(value) {
			setContext(key, value);
			return value;
		},
		use() {
			return getContext<T | undefined>(key);
		},
		get() {
			const value = getContext<T | undefined>(key);
			if (value === undefined) {
				throw new Error(`use${name}Context must be used within ${provider}`);
			}
			return value;
		},
	};
}
