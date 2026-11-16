<script module lang="ts">
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { TimerAction } from './timer.state.svelte';

	export interface TimerActionTriggerProps
		extends Omit<HTMLProps<'button'>, 'type'>, PolymorphicProps<'button'>, RefAttribute {
		action: TimerAction;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Timer.module.css';
	import { useTimerContext } from './timer.state.svelte';

	let {
		action,
		asChild,
		children,
		class: className,
		ref = $bindable(null),
		...props
	}: TimerActionTriggerProps = $props();

	const api = useTimerContext();
	const attrs = $derived(api.actionTriggerAttrs(action));
</script>

<Element
	as="button"
	{...props}
	{...attrs}
	bind:ref
	{asChild}
	data-scope="timer"
	data-part="action-trigger"
	data-slot="timer-action-trigger"
	class={cn(styles.actionTrigger, className)}
>
	{@render children?.()}
</Element>
