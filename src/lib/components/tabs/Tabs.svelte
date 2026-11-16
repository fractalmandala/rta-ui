<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseTabsProps } from './tabs.state.svelte';

	export type TabsVariant = 'default' | 'line';
	export type TabsSize = 'sm' | 'md' | 'lg';

	export interface TabsRootProps
		extends UseTabsProps, HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {
		variant?: TabsVariant;
		size?: TabsSize;
		fitted?: boolean;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Tabs.module.css';
	import { createTabs, setTabsContext } from './tabs.state.svelte';

	let {
		activationMode,
		asChild,
		children,
		class: className,
		composite,
		defaultValue,
		deselectable,
		dir,
		fitted,
		id,
		ids,
		loopFocus,
		onFocusChange,
		onValueChange,
		orientation,
		ref = $bindable(null),
		size = 'md',
		translations,
		value = $bindable(),
		variant = 'default',
		...props
	}: TabsRootProps = $props();

	const uid = $props.id();
	const api = createTabs(
		() => ({
			activationMode,
			composite,
			defaultValue,
			deselectable,
			dir,
			id,
			ids,
			loopFocus,
			onFocusChange,
			onValueChange(details) {
				onValueChange?.(details);
				value = details.value;
			},
			orientation,
			translations,
			value
		}),
		uid
	);
	setTabsContext(api);
	const rootAttrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...rootAttrs}
	data-scope="tabs"
	data-part="root"
	data-variant={variant}
	data-size={size}
	data-fitted={fitted ? '' : undefined}
	data-slot="tabs-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
