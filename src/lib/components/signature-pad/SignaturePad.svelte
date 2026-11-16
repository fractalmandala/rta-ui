<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseSignaturePadProps } from './signature-pad.state.svelte';

	export interface SignaturePadRootProps
		extends UseSignaturePadProps,
			HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { useFieldContext } from '../field/field.state.svelte';
	import styles from './SignaturePad.module.css';
	import { createSignaturePad, setSignaturePadContext, setSignaturePadReadOnly } from './signature-pad.state.svelte';

	let {
		asChild,
		children,
		class: className,
		defaultPaths,
		dir,
		disabled,
		drawing,
		id,
		ids,
		name,
		onDraw,
		onDrawEnd,
		paths = $bindable(),
		readOnly,
		ref = $bindable(null),
		required,
		translations,
		...props
	}: SignaturePadRootProps = $props();

	const uid = $props.id();
	const field = useFieldContext();
	const resolvedReadOnly = $derived(readOnly ?? field?.readOnly);

	setSignaturePadReadOnly(() => resolvedReadOnly);

	const api = createSignaturePad(
		() => ({
			defaultPaths,
			dir,
			disabled,
			drawing,
			id,
			ids,
			name,
			onDraw(details) {
				onDraw?.(details);
				paths = details.paths;
			},
			onDrawEnd,
			paths,
			readOnly: resolvedReadOnly,
			required,
			translations,
		}),
		uid,
	);
	setSignaturePadContext(api);

	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="signature-pad"
	data-part="root"
	data-slot="signature-pad-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
