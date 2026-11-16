<script lang="ts">
	import {
		createToc,
		TocContent,
		TocIndicator,
		TocItem,
		TocLink,
		TocList,
		TocNav,
		TocRail,
		TocRootProvider,
		TocTitle,
		type TocActiveChangeDetails,
		type TocItemData
	} from '../../src/lib/components/toc/index';

	let {
		items = [
			{ value: 'introduction', depth: 2, label: 'Introduction' },
			{ value: 'configuration', depth: 3, label: 'Configuration' },
			{ value: 'usage', depth: 2, label: 'Usage' }
		] as TocItemData[],
		activeIds = undefined as string[] | undefined,
		defaultActiveIds = undefined as string[] | undefined,
		multiple = undefined as boolean | undefined,
		autoScroll = false,
		rootMargin = undefined as string | undefined,
		threshold = undefined as number | undefined,
		indicator = true,
		rail = false,
		onActiveChange = undefined as ((details: TocActiveChangeDetails) => void) | undefined,
		scrollEl = undefined as (() => HTMLElement | null) | undefined
	} = $props();

	const uid = $props.id();
	const toc = createToc(
		() => ({
			activeIds,
			autoScroll,
			defaultActiveIds,
			items,
			multiple,
			onActiveChange,
			rootMargin,
			scrollEl,
			threshold
		}),
		uid
	);

	export const setActiveIds = (value: string[]) => toc.setActiveIds(value);
	export const getActiveIds = () => toc.activeIds;
	export const getIndicatorRect = () => toc.indicatorRect;
	export const getId = () => toc.rootId;
</script>

<TocRootProvider value={toc}>
	<TocContent>
		{#each items as item (item.value)}
			{#if item.depth === 2}
				<h2 id={item.value}>{item.label ?? item.value}</h2>
			{:else if item.depth === 3}
				<h3 id={item.value}>{item.label ?? item.value}</h3>
			{:else}
				<h4 id={item.value}>{item.label ?? item.value}</h4>
			{/if}
		{/each}
	</TocContent>
	<TocNav>
		<TocTitle>On this page</TocTitle>
		<TocList>
			{#if indicator}<TocIndicator />{/if}
			{#each items as item, index (item.value)}
				<TocItem {item}>
					<TocLink href={`#${item.value}`}>
						{#if rail}
							<TocRail
								depth={item.depth}
								previousDepth={items[index - 1]?.depth}
								nextDepth={items[index + 1]?.depth}
							/>
						{/if}
						{item.label ?? item.value}
					</TocLink>
				</TocItem>
			{/each}
		</TocList>
	</TocNav>
</TocRootProvider>
