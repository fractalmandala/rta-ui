<script lang="ts">
	import type { DocPage } from '#lib/docs.js';
	import { demoFor, hasOwnDemo } from '#lib/demos.js';
	import * as ui from '#lib/index.js';
	import VariationGrid from '../VariationGrid.svelte';

	let {
		data
	}: {
		data: { page: DocPage; previous?: DocPage; next?: DocPage };
	} = $props();

	const page = $derived(data.page);
	const demo = $derived(demoFor(page.slug));
	const ownDemo = $derived(hasOwnDemo(page.slug));
	const rootExport = $derived(
		page.slug
			.split('-')
			.map((part) => part[0].toUpperCase() + part.slice(1))
			.join('')
	);
	const rootComponent = $derived(
		(ui as unknown as Record<string, never>)[rootExport] as
			| import('svelte').Component<Record<string, unknown>>
			| undefined
	);
</script>

<svelte:head>
	<title>{page.title} — rta ui</title>
	<meta name="description" content={page.description} />
</svelte:head>

<article>
	<header>
		<p class="group">{page.group}</p>
		<h1>{page.title}</h1>
		{#if page.description}
			<p class="lead">{page.description}</p>
		{/if}
	</header>

	{#if demo || (rootComponent && page.variations.length)}
		<section class="examples" aria-label={`${page.title} examples`}>
			<h2>Examples</h2>
			{#if demo}
				<h3>Overview</h3>
				{@const TheDemo = demo}
				<div class="preview-canvas"><TheDemo /></div>
				{#if ownDemo}
					<a class="gallery-link" href={`/?c=${page.slug}`}>Open this example in the gallery ↗</a>
				{:else}
					<a class="gallery-link" href="/">Shown with its sibling components in the gallery ↗</a>
				{/if}
			{/if}
			{#if rootComponent}
				{#each page.variations as variation (variation.prop)}
					<VariationGrid
						component={rootComponent}
						prop={variation.prop}
						values={variation.values}
						title={variation.prop[0].toUpperCase() + variation.prop.slice(1)}
						sample={rootExport}
					/>
				{/each}
			{/if}
		</section>
	{:else if !demo}
		<p class="no-preview">
			Shared state module: there is no markup to preview. See <a href="/docs/progress-linear">ProgressLinear</a>
			and <a href="/docs/progress-circular">ProgressCircular</a> for the components built on it.
		</p>
	{/if}

	{#if page.headings.length}
		<nav class="toc" aria-label="On this page">
			{#each page.headings.filter((heading) => heading.level === 2) as heading (heading.id)}
				<a href={`#${heading.id}`}>{heading.text}</a>
			{/each}
		</nav>
	{/if}

	<div class="prose">
		{@html page.html}
	</div>

	<nav class="pager" aria-label="Component pages">
		{#if data.previous}
			<a href={`/docs/${data.previous.slug}`} class="prev">
				<span>Previous</span>
				{data.previous.title}
			</a>
		{:else}
			<span></span>
		{/if}
		{#if data.next}
			<a href={`/docs/${data.next.slug}`} class="next">
				<span>Next</span>
				{data.next.title}
			</a>
		{/if}
	</nav>
</article>

<style>
	article {
		max-width: 60rem;
	}

	header {
		margin-bottom: 1.75rem;
	}

	.group {
		margin: 0 0 0.35rem;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--moduix-foreground-subtle, color-mix(in oklab, currentColor 55%, transparent));
	}

	h1 {
		margin: 0;
		font-size: clamp(1.9rem, 4vw, 2.6rem);
		letter-spacing: -0.02em;
		line-height: 1.1;
	}

	.lead {
		margin: 0.6rem 0 0;
		font-size: 1.05rem;
		line-height: 1.55;
		color: var(--moduix-foreground-muted, color-mix(in oklab, currentColor 75%, transparent));
	}

	.examples {
		margin: 0 0 2.5rem;
	}

	.examples h2 {
		margin: 0 0 1rem;
		font-size: 1.3rem;
		letter-spacing: -0.01em;
	}

	.examples h3 {
		margin: 0 0 0.6rem;
		font-size: 0.95rem;
		letter-spacing: -0.01em;
	}

	.preview-canvas {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
		margin: 0 0 0.5rem;
		padding: 1.5rem;
		border: 1px solid var(--moduix-border);
		border-radius: var(--moduix-radius-md, 0.5rem);
	}

	.preview-canvas :global(> *) {
		max-width: 100%;
	}

	.gallery-link {
		display: inline-block;
		margin: 0 0 1.75rem;
		font-size: 0.78rem;
		color: var(--moduix-accent, #6c5ce7);
		text-decoration: none;
	}

	.gallery-link:hover {
		text-decoration: underline;
	}

	.no-preview {
		margin: 0 0 2rem;
		padding: 0.75rem 0.9rem;
		border: 1px dashed var(--moduix-border);
		border-radius: var(--moduix-radius-md, 0.5rem);
		font-size: 0.9rem;
	}

	.toc {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem 0.9rem;
		margin: 0 0 2rem;
		padding: 0.75rem 0.9rem;
		border: 1px solid var(--moduix-border);
		border-radius: var(--moduix-radius-md, 0.5rem);
		font-size: 0.82rem;
	}

	.toc a {
		color: inherit;
		text-decoration: none;
		opacity: 0.75;
	}

	.toc a:hover {
		opacity: 1;
		text-decoration: underline;
	}

	.pager {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 3rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--moduix-border);
		font-size: 0.9rem;
	}

	.pager a {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		color: inherit;
		text-decoration: none;
	}

	.pager a span {
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		opacity: 0.55;
	}

	.pager .next {
		text-align: end;
		margin-inline-start: auto;
	}

	.pager a:hover {
		text-decoration: underline;
	}
	/* Prose styles for the generated markdown, scoped through the wrapper class. */
	.prose {
		font-size: 0.95rem;
		line-height: 1.65;
	}

	.prose :global(h2) {
		margin: 2.5rem 0 0.75rem;
		padding-top: 0.5rem;
		font-size: 1.3rem;
		letter-spacing: -0.01em;
		border-top: 1px solid var(--moduix-border);
	}

	.prose :global(h2:first-child) {
		margin-top: 0;
		border-top: 0;
	}

	.prose :global(h3) {
		margin: 1.75rem 0 0.5rem;
		font-size: 1.02rem;
		font-family: var(--moduix-font-mono, ui-monospace, monospace);
	}

	.prose :global(p) {
		margin: 0.7rem 0;
	}

	.prose :global(a) {
		color: var(--moduix-accent, #6c5ce7);
	}

	.prose :global(code) {
		padding: 0.1rem 0.3rem;
		border-radius: 0.3rem;
		background: var(--moduix-background-subtle, color-mix(in oklab, currentColor 8%, transparent));
		font-family: var(--moduix-font-mono, ui-monospace, monospace);
		font-size: 0.86em;
	}

	.prose :global(pre) {
		margin: 1rem 0;
		padding: 0.9rem 1rem;
		overflow-x: auto;
		border: 1px solid var(--moduix-border);
		border-radius: var(--moduix-radius-md, 0.5rem);
		background: var(--moduix-background-subtle, color-mix(in oklab, currentColor 5%, transparent));
	}

	.prose :global(pre code) {
		padding: 0;
		background: none;
		font-size: 0.82rem;
		line-height: 1.6;
	}

	.prose :global(table) {
		width: 100%;
		margin: 1rem 0;
		border-collapse: collapse;
		font-size: 0.86rem;
	}

	.prose :global(th),
	.prose :global(td) {
		padding: 0.45rem 0.6rem;
		border-bottom: 1px solid var(--moduix-border);
		text-align: start;
		vertical-align: top;
	}

	.prose :global(th) {
		font-size: 0.75rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		opacity: 0.7;
	}

	.prose :global(td:first-child) {
		white-space: nowrap;
	}

	.prose :global(ul),
	.prose :global(ol) {
		margin: 0.7rem 0;
		padding-inline-start: 1.25rem;
	}

	.prose :global(li) {
		margin: 0.25rem 0;
	}

	.prose :global(hr) {
		margin: 2rem 0;
		border: 0;
		border-top: 1px solid var(--moduix-border);
	}

	.prose :global(strong) {
		font-weight: 650;
	}

	@media (max-width: 40rem) {
		.prose :global(td:first-child) {
			white-space: normal;
		}
	}
</style>
