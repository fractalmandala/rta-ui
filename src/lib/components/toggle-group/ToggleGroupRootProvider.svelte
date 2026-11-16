<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ToggleSize, ToggleVariant } from '../toggle/toggle.state.svelte';
	import type { ToggleGroupApi } from './toggle-group.state.svelte';

	export interface ToggleGroupRootProviderProps
		extends HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		value: ToggleGroupApi;
		size?: ToggleSize;
		variant?: ToggleVariant;
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './ToggleGroup.module.css';
	import {
		setToggleGroupContext,
		setToggleGroupStyleContext,
		toggleGroupRootAttrs
	} from './toggle-group.state.svelte';

	let {
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		size = 'md',
		value,
		variant = 'default',
		...props
	}: ToggleGroupRootProviderProps = $props();

	const api = untrack(() => value);
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
	data-slot="toggle-group-root-provider"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
