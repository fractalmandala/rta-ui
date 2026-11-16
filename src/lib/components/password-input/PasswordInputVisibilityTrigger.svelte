<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface PasswordInputVisibilityTriggerProps
		extends HTMLProps<'button'>, PolymorphicProps<'button'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './PasswordInput.module.css';
	import { usePasswordInputContext } from './password-input.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: PasswordInputVisibilityTriggerProps = $props();

	const api = usePasswordInputContext();
	const attrs = $derived(api.visibilityTriggerAttrs());
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="password-input"
	data-part="visibility-trigger"
	data-slot="password-input-visibility-trigger"
	class={cn(styles.visibilityTrigger, className)}
>
	{@render children?.()}
</Element>
