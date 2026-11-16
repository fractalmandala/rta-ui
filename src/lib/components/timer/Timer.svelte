<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { UseTimerProps } from './timer.state.svelte';

	export interface TimerRootProps
		extends UseTimerProps, HTMLProps<'div'>, PolymorphicProps<'div'>, RefAttribute {}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Timer.module.css';
	import { createTimer, setTimerContext } from './timer.state.svelte';

	let {
		asChild,
		autoStart,
		children,
		class: className,
		countdown,
		id,
		interval,
		onComplete,
		onTick,
		ref = $bindable(null),
		startMs,
		targetMs,
		translations,
		...props
	}: TimerRootProps = $props();

	const uid = $props.id();
	const api = createTimer(
		() => ({
			autoStart,
			countdown,
			id,
			interval,
			onComplete,
			onTick,
			startMs,
			targetMs,
			translations
		}),
		uid
	);
	setTimerContext(api);
	const attrs = $derived(api.rootAttrs());
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="timer"
	data-part="root"
	data-slot="timer-root"
	class={cn(styles.root, className)}
>
	{@render children?.()}
</Element>
