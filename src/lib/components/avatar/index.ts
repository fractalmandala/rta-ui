export { default as Avatar } from './Avatar.svelte';
export { default as AvatarFallback } from './AvatarFallback.svelte';
export { default as AvatarGroup } from './AvatarGroup.svelte';
export { default as AvatarImage } from './AvatarImage.svelte';
export { default as AvatarRootProvider } from './AvatarRootProvider.svelte';

export { createAvatar, setAvatarContext, useAvatarContext } from './avatar.state.svelte';

export type { AvatarApi, UseAvatarProps } from './avatar.state.svelte';
export type { AvatarRootProps, AvatarSize } from './Avatar.svelte';
export type { AvatarFallbackProps } from './AvatarFallback.svelte';
export type { AvatarGroupProps } from './AvatarGroup.svelte';
export type { AvatarImageProps } from './AvatarImage.svelte';
export type { AvatarRootProviderProps } from './AvatarRootProvider.svelte';
