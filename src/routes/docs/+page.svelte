<script lang="ts">
	import type { DocPage } from '#lib/docs.js';

	let {
		data
	}: {
		data: { groups: { group: string; pages: DocPage[] }[]; count: number };
	} = $props();
</script>

<svelte:head>
	<title>rta ui docs</title>
	<meta name="description" content={`Documentation for the ${data.count} components in rta ui.`} />
</svelte:head>

<header>
	<h1>rta ui</h1>
	<p class="lead">
		{data.count} dependency-free Svelte 5 components. Every page is generated from the component source,
		its gallery demo and its tests.
	</p>
</header>

{#each data.groups as group (group.group)}
	<section>
		<h2>{group.group}</h2>
		<ul>
			{#each group.pages as page (page.slug)}
				<li>
					<a href={`/docs/${page.slug}`}>
						<span class="name">{page.title}</span>
						<span class="description">{page.description}</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>
{/each}

<style>
	header {
		margin-bottom: 2.5rem;
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 4vw, 2.75rem);
		letter-spacing: -0.02em;
	}

	.lead {
		margin: 0.6rem 0 0;
		max-width: 44rem;
		font-size: 1.05rem;
		line-height: 1.55;
		color: var(--moduix-foreground-muted, color-mix(in oklab, currentColor 75%, transparent));
	}

	section {
		margin-bottom: 2.25rem;
	}

	h2 {
		margin: 0 0 0.75rem;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--moduix-foreground-subtle, color-mix(in oklab, currentColor 55%, transparent));
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: 0.5rem;
	}

	a {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		height: 100%;
		padding: 0.7rem 0.85rem;
		border: 1px solid var(--moduix-border);
		border-radius: var(--moduix-radius-md, 0.5rem);
		color: inherit;
		text-decoration: none;
		transition: border-color 120ms ease, background-color 120ms ease;
	}

	a:hover {
		border-color: var(--moduix-primary, #6c5ce7);
		background: var(--moduix-background-subtle, color-mix(in oklab, currentColor 4%, transparent));
	}

	.name {
		font-weight: 600;
		font-size: 0.95rem;
	}

	.description {
		font-size: 0.82rem;
		line-height: 1.45;
		opacity: 0.7;
	}
</style>
