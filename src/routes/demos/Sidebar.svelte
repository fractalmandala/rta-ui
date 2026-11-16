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
		SidebarPanel,
		SidebarRail,
		SidebarResizeTrigger,
		SidebarSeparator,
		SidebarTooltip,
		SidebarTrigger
	} from '../../lib/components/sidebar/index';

	const items = [
		{ value: 'inbox', label: 'Inbox', icon: '▤' },
		{ value: 'reports', label: 'Reports', icon: '▦', badge: '4' },
		{ value: 'settings', label: 'Settings', icon: '⚙' }
	];

	let active = $state('inbox');
</script>

<div style="height: 24rem; border: 1px solid var(--moduix-sidebar-border); border-radius: var(--moduix-radius-lg); overflow: hidden">
	<Sidebar defaultOpen collapsible="icon" aria-label="Workspace navigation">
		<SidebarPanel mobileTitle="Navigation">
			<SidebarHeader>
				<SidebarLabel>Acme</SidebarLabel>
				<SidebarTrigger aria-label="Toggle navigation" />
			</SidebarHeader>
			<SidebarContent>
				<SidebarCollapsedContent>
					<SidebarNavigationList aria-label="Icons">
						{#each items as item (item.value)}
							<SidebarNavigationItem>
								<SidebarNavigationButton
									active={active === item.value}
									onclick={() => (active = item.value)}
								>
									<span data-sidebar-icon>{item.icon}</span>
								</SidebarNavigationButton>
							</SidebarNavigationItem>
						{/each}
					</SidebarNavigationList>
				</SidebarCollapsedContent>
				<SidebarExpandedContent>
					<SidebarGroup>
						<SidebarGroupHeader>
							<SidebarGroupLabel>Workspace</SidebarGroupLabel>
							<SidebarGroupAction aria-label="Add workspace">+</SidebarGroupAction>
						</SidebarGroupHeader>
						<SidebarNavigationList aria-label="Main">
							{#each items as item (item.value)}
								<SidebarNavigationItem>
									<SidebarTooltip content={item.label}>
										{#snippet children(triggerProps)}
											{@const merged = triggerProps() as HTMLButtonAttributes}
											<SidebarNavigationButton
												{...merged}
												active={active === item.value}
												onclick={() => (active = item.value)}
											>
												<span data-sidebar-icon>{item.icon}</span>
												<span>{item.label}</span>
												{#if item.badge}
													<SidebarNavigationBadge>{item.badge}</SidebarNavigationBadge>
												{/if}
											</SidebarNavigationButton>
										{/snippet}
									</SidebarTooltip>
								</SidebarNavigationItem>
							{/each}
						</SidebarNavigationList>
					</SidebarGroup>
					<SidebarSeparator />
				</SidebarExpandedContent>
			</SidebarContent>
			<SidebarFooter>
				<SidebarRail>Rail</SidebarRail>
			</SidebarFooter>
			<SidebarResizeTrigger />
		</SidebarPanel>
		<SidebarInset>
			<p style="padding: var(--moduix-spacing-4)">Selected page: {active}</p>
		</SidebarInset>
	</Sidebar>
</div>
