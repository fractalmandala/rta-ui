<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseQrCodeProps } from './qr-code.state.svelte';

	export interface QrCodeRootProps
		extends Omit<UseQrCodeProps, 'value'>,
			HTMLProps<'div'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		value?: string;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './QrCode.module.css';
	import { createQrCode, setQrCodeContext } from './qr-code.state.svelte';

	let {
		asChild,
		children,
		class: className,
		defaultValue,
		dir,
		encoding,
		id,
		ids,
		onValueChange,
		pixelSize,
		ref = $bindable(null),
		value = $bindable(undefined),
		...props
	}: QrCodeRootProps = $props();

	const providedId = $props.id();
	const api = createQrCode(
		() => ({
			defaultValue,
			dir,
			encoding,
			id: id ?? providedId,
			ids,
			onValueChange(details) {
				onValueChange?.(details);
				if (value !== undefined) value = details.value;
			},
			pixelSize,
			value
		}),
		providedId
	);
	setQrCodeContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	bind:ref
	{asChild}
	data-scope="qr-code"
	data-part="root"
	data-slot="qr-code-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
