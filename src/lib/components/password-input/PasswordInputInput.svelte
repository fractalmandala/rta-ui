<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';

	export interface PasswordInputInputProps
		extends HTMLProps<'input'>, PolymorphicProps<'input'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { useFieldContext } from '../field/field.state.svelte';
	import styles from './PasswordInput.module.css';
	import { usePasswordInputContext } from './password-input.state.svelte';

	let {
		asChild,
		class: className,
		ref = $bindable(null),
		value = $bindable(),
		...props
	}: PasswordInputInputProps = $props();

	const api = usePasswordInputContext();
	const field = useFieldContext();
	const attrs = $derived({
		...api.inputAttrs(),
		'aria-describedby': field?.ariaDescribedby
	});

	$effect(() => {
		api.registerInput(ref as HTMLInputElement | null);
	});
</script>

<Element
	as="input"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="password-input"
	data-part="input"
	data-slot="password-input-input"
	class={cn(styles.input, className)}
	{value}
	oninput={(event) => {
		value = event.currentTarget.value;
		props.oninput?.(event);
	}}
/>
