<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ToggleSize, ToggleVariant } from '../toggle/toggle.state.svelte';
	import type { UseToggleGroupProps } from './toggle-group.state.svelte';

	export interface ToggleGroupRootProps
		extends UseToggleGroupProps, HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		size?: ToggleSize;
		variant?: ToggleVariant;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './ToggleGroup.module.css';
	import {
		createToggleGroup,
		setToggleGroupContext,
		setToggleGroupStyleContext,
		toggleGroupRootAttrs
	} from './toggle-group.state.svelte';

	let {
		asChild,
		children,
		class: className,
		defaultValue,
		deselectable,
		dir,
		disabled,
		id,
		ids,
		loopFocus,
		multiple,
		onValueChange,
		orientation,
		ref = $bindable(null),
		rovingFocus,
		size = 'md',
		value = $bindable(),
		variant = 'default',
		...props
	}: ToggleGroupRootProps = $props();

	const uid = $props.id();
	const api = createToggleGroup(
		() => ({
			defaultValue,
			deselectable,
			dir,
			disabled,
			id,
			ids,
			loopFocus,
			multiple,
			onValueChange(details) {
				onValueChange?.(details);
				value = details.value;
			},
			orientation,
			rovingFocus,
			value
		}),
		uid
	);
	setToggleGroupContext(api);
	setToggleGroupStyleContext({
		get size() {
			return size;
		},
		get variant() {
			return variant;
		}
	});
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...toggleGroupRootAttrs(api)}
	data-scope="toggle-group"
	data-part="root"
	data-size={size}
	data-variant={variant}
	data-slot="toggle-group-root"
	onmousedown={() => api.blur()}
	onfocus={(event) => {
		if (event.currentTarget === event.target) api.blur();
	}}
	onblur={(event) => {
		if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
		api.blur();
	}}
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
