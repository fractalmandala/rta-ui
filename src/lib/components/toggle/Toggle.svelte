<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ToggleSize, ToggleVariant, UseToggleProps } from './toggle.state.svelte';

	export interface ToggleRootProps
		extends Omit<UseToggleProps, 'disabled'>,
			HTMLProps<'button'>,
			PolymorphicProps<'button'>,
			RefAttribute {
		disabled?: boolean;
		size?: ToggleSize;
		variant?: ToggleVariant;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { dataAttr } from '../../internal/dom.js';
	import styles from './Toggle.module.css';
	import { createToggle, setToggleContext } from './toggle.state.svelte';

	let {
		asChild,
		children,
		class: className,
		defaultPressed,
		disabled,
		onPressedChange,
		pressed = $bindable(),
		ref = $bindable(null),
		size = 'md',
		variant = 'default',
		...props
	}: ToggleRootProps = $props();

	const api = createToggle(() => ({
		defaultPressed,
		disabled,
		onPressedChange(details) {
			onPressedChange?.(details);
			if (pressed !== undefined) pressed = details.pressed;
		},
		pressed
	}));
	setToggleContext(api);
</script>

<Element
	as="button"
	{...props}
	bind:ref
	{asChild}
	type="button"
	disabled={api.disabled}
	aria-pressed={api.pressed}
	data-scope="toggle"
	data-part="root"
	data-state={api.state}
	data-pressed={dataAttr(api.pressed)}
	data-disabled={dataAttr(api.disabled)}
	data-size={size}
	data-variant={variant}
	data-slot="toggle-root"
	onclick={(event) => {
		if (event.defaultPrevented) return;
		api.toggle();
	}}
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
