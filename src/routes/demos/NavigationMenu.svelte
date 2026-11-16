<script lang="ts">
	import {
		NavigationMenu,
		NavigationMenuContent,
		NavigationMenuIndicator,
		NavigationMenuItem,
		NavigationMenuItemIndicator,
		NavigationMenuLink,
		NavigationMenuList,
		NavigationMenuTrigger,
		NavigationMenuViewport,
		NavigationMenuViewportPositioner
	} from '../../lib/components/navigation-menu/index';

	let value = $state('products');
</script>

<p>Open: {value || 'none'}</p>

<NavigationMenu bind:value>
	<NavigationMenuList>
		<NavigationMenuItem value="products">
			<NavigationMenuTrigger>Products</NavigationMenuTrigger>
			<NavigationMenuContent>
				<NavigationMenuLink href="#analytics">Analytics</NavigationMenuLink>
				<NavigationMenuLink href="#automation">Automation</NavigationMenuLink>
			</NavigationMenuContent>
			<NavigationMenuItemIndicator />
		</NavigationMenuItem>
		<NavigationMenuItem value="company">
			<NavigationMenuTrigger>Company</NavigationMenuTrigger>
			<NavigationMenuContent>
				<NavigationMenuLink href="#about" current>About</NavigationMenuLink>
				<NavigationMenuLink href="#careers">Careers</NavigationMenuLink>
			</NavigationMenuContent>
		</NavigationMenuItem>
		<NavigationMenuIndicator />
	</NavigationMenuList>
	<NavigationMenuViewportPositioner>
		<NavigationMenuViewport />
	</NavigationMenuViewportPositioner>
</NavigationMenu>
