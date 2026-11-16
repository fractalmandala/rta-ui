<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseMarqueeProps } from './marquee.state.svelte';

	export interface MarqueeRootProps
		extends UseMarqueeProps, HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import { cn } from '../../internal/cn.js';
	import styles from './Marquee.module.css';
	import { createMarquee, setMarqueeContext } from './marquee.state.svelte';

	let {
		asChild,
		children,
		class: className,
		autoFill,
		delay,
		dir,
		id,
		loopCount,
		onComplete,
		onLoopComplete,
		onPauseChange,
		paused = $bindable(),
		defaultPaused,
		pauseOnInteraction,
		ref = $bindable(null),
		reverse,
		side,
		spacing,
		speed,
		translations,
		...props
	}: MarqueeRootProps = $props();

	const uid = $props.id();
	const api = createMarquee(
		() => ({
			autoFill,
			delay,
			defaultPaused,
			loopCount,
			onComplete,
			onLoopComplete,
			reverse,
			side,
			spacing,
			speed,
			dir,
			id,
			onPauseChange(details) {
				onPauseChange?.(details);
				paused = details.paused;
			},
			pauseOnInteraction,
			paused,
			translations
		}),
		uid
	);
	setMarqueeContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	bind:ref
	{asChild}
	{...attrs}
	style={mergeStyleDeclarations(attrs.style, props.style)}
	data-scope="marquee"
	data-part="root"
	data-slot="marquee-root"
	onmouseenter={() => {
		if (pauseOnInteraction) api.pause();
	}}
	onmouseleave={() => {
		if (pauseOnInteraction) api.resume();
	}}
	onfocuscapture={(event) => {
		if (pauseOnInteraction && event.target !== event.currentTarget) api.pause();
	}}
	onblurcapture={(event) => {
		if (pauseOnInteraction && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
			api.resume();
		}
	}}
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
