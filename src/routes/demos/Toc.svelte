<script lang="ts">
	import {
		Toc,
		TocContent,
		TocIndicator,
		TocItem,
		TocLink,
		TocList,
		TocNav,
		TocTitle,
		type TocItemData
	} from '../../lib/components/toc/index';

	const items: TocItemData[] = [
		{ value: 'toc-overview', depth: 2, label: 'Overview' },
		{ value: 'toc-installation', depth: 2, label: 'Installation' },
		{ value: 'toc-configuration', depth: 3, label: 'Configuration' },
		{ value: 'toc-usage', depth: 2, label: 'Usage' }
	];

	const text =
		'A table of contents keeps readers oriented in a long document. The active heading follows the page, and every link is a same-page anchor.';
</script>

<Toc {items} defaultActiveIds={['toc-overview']}>
	<TocContent>
		{#each items as item (item.value)}
			<section>
				{#if item.depth === 2}
					<h2 id={item.value}>{item.label}</h2>
				{:else}
					<h3 id={item.value}>{item.label}</h3>
				{/if}
				<p>{text}</p>
			</section>
		{/each}
	</TocContent>
	<TocNav>
		<TocTitle>On this page</TocTitle>
		<TocList>
			<TocIndicator />
			{#each items as item (item.value)}
				<TocItem {item}>
					<TocLink href={`#${item.value}`}>{item.label}</TocLink>
				</TocItem>
			{/each}
		</TocList>
	</TocNav>
</Toc>
