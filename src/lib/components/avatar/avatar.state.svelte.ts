import { createContext } from '../../internal/context';

export interface UseAvatarProps {
	dir?: 'ltr' | 'rtl' | 'auto' | null;
	id?: string | null;
	ids?: { root?: string; image?: string; fallback?: string };
	onStatusChange?: (details: { status: 'loading' | 'loaded' | 'error' }) => void;
}

export interface AvatarApi {
	readonly loaded: boolean;
	readonly status: 'loading' | 'loaded' | 'error';
	readonly rootId: string;
	readonly imageId: string;
	readonly fallbackId: string;
	setLoaded(): void;
	setError(): void;
	rootAttrs(): Record<string, unknown>;
	imageAttrs(): Record<string, unknown>;
	fallbackAttrs(): Record<string, unknown>;
}

const avatarContext = createContext<AvatarApi>('Avatar', 'Avatar.Root');
export const useAvatarContext = () => avatarContext.get();
export const setAvatarContext = (api: AvatarApi) => avatarContext.set(api);

export function createAvatar(getProps: () => UseAvatarProps, uid: string): AvatarApi {
	const rootId = () => getProps().ids?.root ?? getProps().id ?? `avatar:${uid}`;
	const imageId = () => getProps().ids?.image ?? `${rootId()}:image`;
	const fallbackId = () => getProps().ids?.fallback ?? `${rootId()}:fallback`;

	let status = $state<'loading' | 'loaded' | 'error'>('loading');

	function update(next: 'loading' | 'loaded' | 'error') {
		status = next;
		getProps().onStatusChange?.({ status: next });
	}

	return {
		setLoaded() {
			update('loaded');
		},
		setError() {
			update('error');
		},
		rootAttrs() {
			return { id: rootId(), dir: getProps().dir ?? undefined };
		},
		imageAttrs() {
			const loaded = status === 'loaded';
			return {
				id: imageId(),
				dir: getProps().dir ?? undefined,
				hidden: !loaded,
				'data-state': loaded ? 'visible' : 'hidden'
			};
		},
		fallbackAttrs() {
			const loaded = status === 'loaded';
			return {
				id: fallbackId(),
				dir: getProps().dir ?? undefined,
				hidden: loaded,
				'data-state': loaded ? 'hidden' : 'visible'
			};
		},
		get loaded() {
			return status === 'loaded';
		},
		get status() {
			return status;
		},
		get rootId() {
			return rootId();
		},
		get imageId() {
			return imageId();
		},
		get fallbackId() {
			return fallbackId();
		}
	};
}
