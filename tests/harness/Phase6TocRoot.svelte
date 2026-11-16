<script lang="ts">
	import {
		Toc,
		TocContent,
		TocItem,
		TocLink,
		TocList,
		TocNav,
		TocRail,
		TocTitle,
		type TocItemData
	} from '../../src/lib/components/toc/index';

	const items: TocItemData[] = [
		{ value: 'intro', depth: 2, label: 'Intro' },
		{ value: 'nested', depth: 3, label: 'Nested' },
		{ value: 'deep', depth: 4, label: 'Deep' }
	];
</script>

<Toc {items} defaultActiveIds={['nested']}>
	<TocContent>
		<h2 id="intro">Intro</h2>
		<h3 id="nested">Nested</h3>
		<h4 id="deep">Deep</h4>
	</TocContent>
	<TocNav>
		<TocTitle>On this page</TocTitle>
		<TocList>
			{#each items as item, index (item.value)}
				<TocItem {item}>
					<TocLink href={`#${item.value}`}>
						<TocRail
							depth={item.depth}
							previousDepth={items[index - 1]?.depth}
							nextDepth={items[index + 1]?.depth}
						/>
						{item.label}
					</TocLink>
				</TocItem>
			{/each}
		</TocList>
	</TocNav>
</Toc>
