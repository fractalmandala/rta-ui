<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import {
		Sidebar,
		SidebarCollapsedContent,
		SidebarContent,
		SidebarExpandedContent,
		SidebarFooter,
		SidebarGroup,
		SidebarGroupAction,
		SidebarGroupHeader,
		SidebarGroupLabel,
		SidebarHeader,
		SidebarInset,
		SidebarLabel,
		SidebarNavigationBadge,
		SidebarNavigationButton,
		SidebarNavigationItem,
		SidebarNavigationList,
		SidebarNavigationSubButton,
		SidebarNavigationSubItem,
		SidebarNavigationSubList,
		SidebarPanel,
		SidebarRail,
		SidebarResizeTrigger,
		SidebarSeparator,
		SidebarTooltip,
		SidebarTrigger,
		type SidebarCollapsible,
		type SidebarOpenChangeDetails,
		type SidebarSide
	} from '../../src/lib/components/sidebar/index';

	let {
		open = $bindable(undefined as boolean | undefined),
		defaultOpen = true,
		collapsible = 'icon' as SidebarCollapsible,
		side = 'left' as SidebarSide,
		persist = false,
		persistKey = undefined as string | undefined,
		keyboardShortcut = undefined as false | string | undefined,
		mobile = false,
		onOpenChange = undefined as ((details: SidebarOpenChangeDetails) => void) | undefined
	}: {
		open?: boolean | undefined;
		defaultOpen?: boolean;
		collapsible?: SidebarCollapsible;
		side?: SidebarSide;
		persist?: boolean;
		persistKey?: string;
		keyboardShortcut?: false | string;
		mobile?: boolean;
		onOpenChange?: (details: SidebarOpenChangeDetails) => void;
	} = $props();

	let active = $state('inbox');
</script>

<Sidebar
	bind:open
	{defaultOpen}
	{collapsible}
	{side}
	{persist}
	{persistKey}
	{keyboardShortcut}
	{mobile}
	aria-label="Workspace navigation"
	onOpenChange={(details) => onOpenChange?.(details)}
>
	<SidebarPanel mobileTitle="Navigation">
		<SidebarHeader>
			<SidebarLabel>Acme</SidebarLabel>
			{#if !mobile}
				<SidebarTrigger aria-label="Toggle navigation" />
			{/if}
		</SidebarHeader>
		<SidebarContent>
			<SidebarCollapsedContent>
				<span data-testid="collapsed-content">icons</span>
			</SidebarCollapsedContent>
			<SidebarExpandedContent>
				<span data-testid="expanded-content">labels</span>
			</SidebarExpandedContent>
			<SidebarGroup>
				<SidebarGroupHeader>
					<SidebarGroupLabel>Workspace</SidebarGroupLabel>
					<SidebarGroupAction aria-label="Add workspace">+</SidebarGroupAction>
				</SidebarGroupHeader>
				<SidebarNavigationList aria-label="Main">
					<SidebarNavigationItem>
						<SidebarTooltip content="Inbox">
							{#snippet children(triggerProps)}
								{@const merged = triggerProps() as HTMLButtonAttributes}
								<SidebarNavigationButton
									{...merged}
									active={active === 'inbox'}
									onclick={() => (active = 'inbox')}
								>
									Inbox
								</SidebarNavigationButton>
							{/snippet}
						</SidebarTooltip>
					</SidebarNavigationItem>
					<SidebarNavigationItem>
						<SidebarTooltip content="Reports">
							{#snippet children(triggerProps)}
								{@const merged = triggerProps() as HTMLButtonAttributes}
								<SidebarNavigationButton
									{...merged}
									active={active === 'reports'}
									onclick={() => (active = 'reports')}
								>
									Reports
									<SidebarNavigationBadge>4</SidebarNavigationBadge>
								</SidebarNavigationButton>
							{/snippet}
						</SidebarTooltip>
						<SidebarNavigationSubList aria-label="Reports">
							<SidebarNavigationSubItem>
								<SidebarNavigationSubButton href="#weekly" active={active === 'weekly'}
									>Weekly</SidebarNavigationSubButton
								>
							</SidebarNavigationSubItem>
						</SidebarNavigationSubList>
					</SidebarNavigationItem>
				</SidebarNavigationList>
			</SidebarGroup>
			<SidebarSeparator />
		</SidebarContent>
		<SidebarFooter>
			<SidebarRail>rail</SidebarRail>
		</SidebarFooter>
		<SidebarResizeTrigger />
	</SidebarPanel>
	<SidebarInset>
		{#if mobile}
			<SidebarTrigger aria-label="Toggle navigation" />
		{/if}
		<p data-testid="inset-content">Inset content</p>
	</SidebarInset>
</Sidebar>

<output data-testid="active">{active}</output>
