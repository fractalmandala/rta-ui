<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { PasswordInputApi } from './password-input.state.svelte';
	import type { PasswordInputSize } from './PasswordInput.svelte';

	export interface PasswordInputRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: PasswordInputApi;
		size?: PasswordInputSize;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './PasswordInput.module.css';
	import { setPasswordInputContext } from './password-input.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		size = 'md',
		value,
		...props
	}: PasswordInputRootProviderProps = $props();

	const api = untrack(() => value);
	setPasswordInputContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="password-input"
	data-part="root"
	data-size={size}
	data-slot="password-input-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
