<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseEditableProps } from './editable.state.svelte';

	export interface EditableRootProps
		extends UseEditableProps,
			Omit<HTMLProps<'div'>, 'placeholder'>,
			PolymorphicProps<'div'>,
			RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Editable.module.css';
	import { createEditable, setEditableContext } from './editable.state.svelte';

	let {
		activationMode = 'dblclick',
		asChild,
		children,
		class: className,
		dir,
		edit = $bindable(),
		id,
		ids,
		placeholder,
		ref = $bindable(null),
		value = $bindable(),
		...props
	}: EditableRootProps = $props();

	const uid = $props.id();
	const api = createEditable(
		() => ({
			...props,
			activationMode,
			dir,
			id,
			ids,
			placeholder,
			value,
			edit,
			onValueChange(details) {
				props.onValueChange?.(details);
				if (value !== undefined) value = details.value;
			},
			onEditChange(details) {
				props.onEditChange?.(details);
				if (edit !== undefined) edit = details.edit;
			}
		}),
		uid
	);
	setEditableContext(api);

	const attrs = $derived(api.rootAttrs());

	$effect(() => {
		api.registerRoot(ref);
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="editable"
	data-part="root"
	data-slot="editable-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
