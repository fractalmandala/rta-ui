<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	let { children, data }: { children?: Snippet; data: { groups: { group: string; pages: { slug: string; title: string }[] }[]; count: number } } = $props();

	let filter = $state('');

	const filtered = $derived(
		data.groups
			.map((group) => ({
				group: group.group,
				pages: group.pages.filter((entry) =>
					entry.title.toLowerCase().includes(filter.trim().toLowerCase())
				)
			}))
			.filter((group) => group.pages.length > 0)
	);
</script>

<svelte:head>
	<title>rta ui docs</title>
</svelte:head>

<div class="shell">
	<aside>
		<a class="brand" href="/">
			<span class="mark">rta</span>
			<span class="version">{data.count} components</span>
		</a>

		<label class="search">
			<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
				<circle cx="11" cy="11" r="7" />
				<path d="m20 20-3.5-3.5" />
			</svg>
			<input type="search" placeholder="Filter components" bind:value={filter} aria-label="Filter components" />
		</label>

		<nav>
			{#each filtered as group (group.group)}
				<p class="group">{group.group}</p>
				<ul>
					{#each group.pages as entry (entry.slug)}
						<li>
							<a href={`/docs/${entry.slug}`} aria-current={page.url.pathname === `/docs/${entry.slug}` ? 'page' : undefined}>
								{entry.title}
							</a>
						</li>
					{/each}
				</ul>
			{/each}
			{#if filtered.length === 0}
				<p class="empty">No component matches “{filter}”.</p>
			{/if}
		</nav>

		<a class="gallery" href="/">← Back to the gallery</a>
	</aside>

	<main>
		{@render children?.()}
	</main>
</div>

<style>
	.shell {
		display: grid;
		grid-template-columns: 17rem minmax(0, 1fr);
		min-height: 100vh;
		background: var(--moduix-background);
		color: var(--moduix-foreground);
	}

	aside {
		position: sticky;
		top: 0;
		align-self: start;
		height: 100vh;
		overflow-y: auto;
		padding: 1.5rem 1rem 2rem;
		border-inline-end: 1px solid var(--moduix-border);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.brand {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		padding-inline: 0.5rem;
		color: inherit;
		text-decoration: none;
	}

	.mark {
		font-family: var(--moduix-font-mono, ui-monospace, monospace);
		font-size: 1.375rem;
		font-weight: 700;
		letter-spacing: -0.03em;
	}

	.version {
		font-size: 0.75rem;
		color: var(--moduix-foreground-subtle, color-mix(in oklab, currentColor 60%, transparent));
	}

	.search {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.45rem 0.6rem;
		border: 1px solid var(--moduix-border);
		border-radius: var(--moduix-radius-md, 0.5rem);
		background: var(--moduix-background-subtle, color-mix(in oklab, currentColor 4%, transparent));
	}

	.search svg {
		width: 0.95rem;
		height: 0.95rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		opacity: 0.5;
		flex: none;
	}

	.search input {
		border: 0;
		background: none;
		color: inherit;
		font: inherit;
		font-size: 0.85rem;
		width: 100%;
		outline: none;
	}

	nav {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.group {
		margin: 0 0 0.35rem;
		padding-inline: 0.5rem;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--moduix-foreground-subtle, color-mix(in oklab, currentColor 55%, transparent));
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	li a {
		display: block;
		padding: 0.3rem 0.5rem;
		border-radius: var(--moduix-radius-sm, 0.375rem);
		color: inherit;
		text-decoration: none;
		font-size: 0.875rem;
		opacity: 0.8;
	}

	li a:hover {
		background: var(--moduix-background-subtle, color-mix(in oklab, currentColor 6%, transparent));
		opacity: 1;
	}

	li a[aria-current='page'] {
		background: var(--moduix-accent-subtle, color-mix(in oklab, #6c5ce7 18%, transparent));
		color: var(--moduix-accent-foreground, inherit);
		font-weight: 600;
		opacity: 1;
	}

	.empty {
		padding: 0.5rem;
		font-size: 0.85rem;
		opacity: 0.6;
	}

	.gallery {
		margin-top: auto;
		padding: 0.5rem;
		font-size: 0.85rem;
		color: inherit;
		text-decoration: none;
		opacity: 0.7;
	}

	.gallery:hover {
		opacity: 1;
	}

	main {
		min-width: 0;
		padding: 2.5rem clamp(1.5rem, 5vw, 4rem) 5rem;
	}

	@media (max-width: 52rem) {
		.shell {
			grid-template-columns: 1fr;
		}

		aside {
			position: static;
			height: auto;
			border-inline-end: 0;
			border-block-end: 1px solid var(--moduix-border);
		}

		main {
			padding-top: 1.5rem;
		}
	}
</style>
