<script lang="ts">
	import NavigationMenu from '../../src/lib/components/navigation-menu/NavigationMenu.svelte';
	import NavigationMenuArrow from '../../src/lib/components/navigation-menu/NavigationMenuArrow.svelte';
	import NavigationMenuContent from '../../src/lib/components/navigation-menu/NavigationMenuContent.svelte';
	import NavigationMenuIndicator from '../../src/lib/components/navigation-menu/NavigationMenuIndicator.svelte';
	import NavigationMenuItem from '../../src/lib/components/navigation-menu/NavigationMenuItem.svelte';
	import NavigationMenuItemIndicator from '../../src/lib/components/navigation-menu/NavigationMenuItemIndicator.svelte';
	import NavigationMenuLink from '../../src/lib/components/navigation-menu/NavigationMenuLink.svelte';
	import NavigationMenuList from '../../src/lib/components/navigation-menu/NavigationMenuList.svelte';
	import NavigationMenuTrigger from '../../src/lib/components/navigation-menu/NavigationMenuTrigger.svelte';
	import NavigationMenuViewport from '../../src/lib/components/navigation-menu/NavigationMenuViewport.svelte';
	import NavigationMenuViewportPositioner from '../../src/lib/components/navigation-menu/NavigationMenuViewportPositioner.svelte';
	import type {
		NavigationMenuAlign,
		NavigationMenuOrientation,
		NavigationMenuValueChangeDetails
	} from '../../src/lib/components/navigation-menu';

	let {
		value = $bindable(undefined),
		defaultValue = undefined,
		align = undefined,
		orientation = undefined,
		openDelay = undefined,
		closeDelay = undefined,
		closeOnEscape = undefined,
		closeOnInteractOutside = undefined,
		disableHoverTrigger = undefined,
		withViewport = true,
		withLinkSelect = false,
		keepOpenOnLink = false,
		onValueChange = undefined
	}: {
		value?: string;
		defaultValue?: string;
		align?: NavigationMenuAlign;
		orientation?: NavigationMenuOrientation;
		openDelay?: number;
		closeDelay?: number;
		closeOnEscape?: boolean;
		closeOnInteractOutside?: boolean;
		disableHoverTrigger?: boolean;
		withViewport?: boolean;
		withLinkSelect?: boolean;
		keepOpenOnLink?: boolean;
		onValueChange?: (details: NavigationMenuValueChangeDetails) => void;
	} = $props();
</script>

<NavigationMenu
	{value}
	{defaultValue}
	{orientation}
	{openDelay}
	{closeDelay}
	{closeOnEscape}
	{closeOnInteractOutside}
	{disableHoverTrigger}
	{onValueChange}
>
	<NavigationMenuList>
		<NavigationMenuItem value="products">
			<NavigationMenuTrigger>Products</NavigationMenuTrigger>
			<NavigationMenuContent>
				<NavigationMenuArrow />
				<NavigationMenuLink
					href="#analytics"
					closeOnClick={!keepOpenOnLink}
					onSelect={withLinkSelect ? () => {} : undefined}>Analytics</NavigationMenuLink
				>
				<NavigationMenuLink href="#automation">Automation</NavigationMenuLink>
			</NavigationMenuContent>
			<NavigationMenuItemIndicator />
		</NavigationMenuItem>
		<NavigationMenuItem value="company">
			<NavigationMenuTrigger>Company</NavigationMenuTrigger>
			<NavigationMenuContent>
				<NavigationMenuLink href="#about" current={true}>About</NavigationMenuLink>
			</NavigationMenuContent>
		</NavigationMenuItem>
		<NavigationMenuItem value="docs" disabled>
			<NavigationMenuTrigger>Docs</NavigationMenuTrigger>
		</NavigationMenuItem>
		<NavigationMenuIndicator />
	</NavigationMenuList>
	{#if withViewport}
		<NavigationMenuViewportPositioner {align}>
			<NavigationMenuViewport />
		</NavigationMenuViewportPositioner>
	{/if}
</NavigationMenu>

<button type="button">Outside</button>
