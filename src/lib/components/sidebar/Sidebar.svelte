<script module lang="ts">
	import type { SplitterRootProps } from '../splitter/index';
	import type {
		SidebarCollapsible,
		SidebarOpenChangeDetails,
		SidebarSide
	} from './sidebar.state.svelte';

	export interface SidebarRootProps
		extends Omit<SplitterRootProps, 'defaultSize' | 'id' | 'orientation' | 'panels' | 'size'> {
		/** Widths of the two panels, sidebar first on the left. */
		defaultSize?: Array<number | string>;
		size?: Array<number | string>;
		/** Id of the sidebar panel inside the splitter. */
		panelId?: string;
		side?: SidebarSide;
		/** `offcanvas` slides away, `icon` keeps an icon rail, `none` pins the sidebar open. */
		collapsible?: SidebarCollapsible;
		open?: boolean;
		defaultOpen?: boolean;
		onOpenChange?: (details: SidebarOpenChangeDetails) => void;
		/** Shortcut that toggles the sidebar, `mod+b` by default. `false` disables it. */
		keyboardShortcut?: string | false;
		persist?: boolean;
		persistKey?: string;
		/** Force the mobile sheet layout instead of checking the viewport width. */
		mobile?: boolean;
		mobileBreakpoint?: number;
		width?: string;
		height?: string;
		widthIcon?: string;
		widthMobile?: string;
		triggerOffsetY?: string;
		id?: string | null;
	}
</script>

<script lang="ts">
	import { dataAttr } from '../../internal/dom.js';
	import Element from '../../internal/Element.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import splitterStyles from '../splitter/Splitter.module.css';
	import { createSplitter, setSplitterContext } from '../splitter/splitter.state.svelte';
	import styles from './Sidebar.module.css';
	import {
		createSidebar,
		getSidebarDefaultSize,
		getSidebarPanels,
		setSidebarContext
	} from './sidebar.state.svelte';

	let {
		asChild,
		children,
		class: className,
		collapsible = 'icon',
		defaultOpen,
		defaultSize,
		dir,
		height,
		id,
		keyboardResizeBy,
		keyboardShortcut,
		mobile,
		mobileBreakpoint,
		onCollapse,
		onExpand,
		onOpenChange,
		onResize,
		onResizeEnd,
		onResizeStart,
		open = $bindable(),
		panelId = 'sidebar',
		persist = false,
		persistKey,
		ref = $bindable(null),
		side = 'left',
		size = $bindable(undefined),
		style,
		triggerOffsetY,
		width,
		widthIcon,
		widthMobile,
		...props
	}: SidebarRootProps = $props();

	const uid = $props.id();
	const panels = $derived(getSidebarPanels(side, panelId));
	const initialSize = $derived(defaultSize ?? getSidebarDefaultSize(side));
	const collapsedSize = $derived(side === 'left' ? [0, 100] : [100, 0]);
	let internalSize = $state<Array<number | string> | undefined>(size);
	const splitterSize = $derived(
		pinned() ? (internalSize ?? initialSize) : collapsedSize
	);

	const api = createSidebar(
		() => ({
			collapsible,
			defaultOpen,
			dir,
			height,
			id,
			keyboardShortcut,
			mobile,
			mobileBreakpoint,
			open,
			panelId,
			persist,
			persistKey,
			side,
			triggerOffsetY,
			width,
			widthIcon,
			widthMobile,
			onOpenChange(details) {
				open = details.open;
				onOpenChange?.(details);
			}
		}),
		uid
	);

	const splitterApi = createSplitter(
		() => ({
			panels,
			defaultSize: initialSize,
			orientation: 'horizontal',
			dir,
			id,
			keyboardResizeBy,
			size: splitterSize,
			onResize(details) {
				internalSize = details.size;
				if (size !== undefined) size = details.size;
				onResize?.(details);
			},
			onResizeStart,
			onResizeEnd,
			onCollapse(details) {
				if (details.panelId === panelId) api.setOpen(false);
				onCollapse?.(details);
			},
			onExpand(details) {
				if (details.panelId === panelId) api.setOpen(true);
				onExpand?.(details);
			}
		}),
		uid
	);
	setSplitterContext(splitterApi);
	setSidebarContext(api);


	/** The sidebar renders at its expanded width unless it is collapsed or pinned open. */
	function pinned() {
		return api.open || api.collapsible === 'none';
	}

	const splitterAttrs = $derived(splitterApi.rootAttrs());
	const sidebarAttrs = $derived(api.rootAttrs());
	const attrs = $derived(
		api.mobile
			? sidebarAttrs
			: {
					id: sidebarAttrs.id,
					dir: splitterAttrs.dir,
					style: splitterAttrs.style,
					'data-orientation': splitterAttrs['data-orientation'],
					'data-dragging': splitterAttrs['data-dragging'],
					'data-state': api.state,
					'data-collapsible': api.collapsible,
					'data-side': api.side,
					'data-mobile': dataAttr(api.mobile)
				}
	);
	const rootStyle = $derived(
		mergeStyleDeclarations(attrs.style, [sidebarAttrs.style, style].filter(Boolean).join(';'))
	);

	$effect(() => {
		api.registerRoot(ref);
	});
</script>

<Element
	as="div"
	{...props}
	{...attrs}
	style={rootStyle}
	bind:ref
	{asChild}
	data-scope="sidebar"
	data-part="root"
	data-slot="sidebar-root"
	class={cn(!api.mobile && splitterStyles.root, styles.root, className)}
>
	{@render children?.()}
</Element>
