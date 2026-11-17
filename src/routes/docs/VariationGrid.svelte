<script lang="ts">
	import type { Component } from 'svelte';

	let {
		component,
		prop,
		values,
		title,
		sample
	}: {
		component: Component<Record<string, unknown>>;
		prop: string;
		values: string[];
		title: string;
		/** The root's tag for the code sample, e.g. `Button`. */
		sample: string;
	} = $props();
</script>

<section class="example">
	<h3>{title}</h3>
	<div class="grid" aria-label={`${title} example`}>
		{#each values as value (value)}
			{@const Root = component}
			<Root {...{ [prop]: value }}>{value}</Root>
		{/each}
	</div>
	<details>
		<summary>Code</summary>
		<pre><code>{`<${sample} ${prop}="…">{value}</${sample}>`}</code></pre>
	</details>
</section>

<style>
	.example {
		margin: 0 0 1.75rem;
	}

	h3 {
		margin: 0 0 0.6rem;
		font-size: 0.95rem;
		letter-spacing: -0.01em;
	}

	.grid {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
		padding: 1.25rem;
		border: 1px solid var(--moduix-border);
		border-radius: var(--moduix-radius-md, 0.5rem);
	}

	details {
		margin-top: 0.4rem;
		font-size: 0.8rem;
	}

	summary {
		cursor: pointer;
		opacity: 0.6;
	}

	summary:hover {
		opacity: 1;
	}

	pre {
		margin: 0.5rem 0 0;
		padding: 0.7rem 0.85rem;
		overflow-x: auto;
		border: 1px solid var(--moduix-border);
		border-radius: var(--moduix-radius-sm, 0.375rem);
		background: var(--moduix-background-subtle, color-mix(in oklab, currentColor 5%, transparent));
	}

	code {
		font-family: var(--moduix-font-mono, ui-monospace, monospace);
		font-size: 0.8rem;
	}
</style>
