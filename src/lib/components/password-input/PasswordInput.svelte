<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UsePasswordInputProps } from './password-input.state.svelte';

	export type PasswordInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

	export interface PasswordInputRootProps
		extends UsePasswordInputProps, HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		size?: PasswordInputSize;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './PasswordInput.module.css';
	import { createPasswordInput, setPasswordInputContext } from './password-input.state.svelte';

	let {
		asChild,
		autoComplete,
		children,
		class: className,
		defaultVisible,
		dir,
		disabled,
		id,
		ids,
		ignorePasswordManagers,
		invalid,
		name,
		onVisibilityChange,
		readOnly,
		ref = $bindable(null),
		required,
		size = 'md',
		translations,
		visible = $bindable(),
		...props
	}: PasswordInputRootProps = $props();

	const uid = $props.id();
	const api = createPasswordInput(
		() => ({
			autoComplete,
			defaultVisible,
			dir,
			disabled,
			id,
			ids,
			ignorePasswordManagers,
			invalid,
			name,
			onVisibilityChange(details) {
				onVisibilityChange?.(details);
				if (visible !== undefined) visible = details.visible;
			},
			readOnly,
			required,
			translations,
			visible
		}),
		uid
	);
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
	data-slot="password-input-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
