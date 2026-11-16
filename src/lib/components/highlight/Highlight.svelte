<script module lang="ts">
	import type { HTMLProps, PolymorphicProps } from '../../internal/types';
	import type { UseHighlightProps } from './highlight.js';

	export type HighlightRootProps = UseHighlightProps &
		HTMLProps<'mark'> &
		Omit<PolymorphicProps<'mark'>, 'as'>;
</script>

<script lang="ts">
	import { cn } from '../../internal/cn.js';
	import styles from './Highlight.module.css';
	import { highlightWord } from './highlight.js';

	let { class: className, exactMatch, ignoreCase, matchAll, query, text, ...props }: HighlightRootProps =
		$props();

	const chunks = $derived(highlightWord({ exactMatch, ignoreCase, matchAll, query, text }));
</script>

{#each chunks as chunk, index (index)}
	{#if chunk.match}
		<mark {...props} data-scope="highlight" data-part="root" data-slot="highlight-root" class={cn(styles.root, className)}>{chunk.text}</mark>
	{:else}
		{chunk.text}
	{/if}
{/each}
