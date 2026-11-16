<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { TimerTimePart } from './timer.state.svelte';

	export interface TimerSegmentsProps
		extends Omit<HTMLProps<'div'>, 'children'>,
			PolymorphicProps<'div'>,
			RefAttribute {
		separator?: Snippet | string;
		types?: TimerTimePart[];
	}

	const defaultTypes: TimerTimePart[] = ['hours', 'minutes', 'seconds'];
</script>

<script lang="ts">
	import TimerArea from './TimerArea.svelte';
	import TimerItem from './TimerItem.svelte';
	import TimerSeparator from './TimerSeparator.svelte';

	let {
		ref = $bindable(null),
		separator = ':',
		types = defaultTypes,
		...props
	}: TimerSegmentsProps = $props();
</script>

<TimerArea {...props} bind:ref>
	{#each types as type, index (`${type}-${index}`)}
		<TimerItem {type} />{#if index < types.length - 1}<TimerSeparator
				>{#if typeof separator === 'string'}{separator}{:else}{@render separator()}{/if}</TimerSeparator
			>{/if}
	{/each}
</TimerArea>
