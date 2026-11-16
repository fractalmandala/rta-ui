<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLProps, PolymorphicProps, RefAttribute } from '../../internal/types';
	import type { ToastRecord } from './toast.state.svelte';

	export interface ToastViewportProps
		extends Omit<HTMLProps<'div'>, 'children'>,
			Omit<PolymorphicProps<'div'>, 'children'>,
			RefAttribute<HTMLDivElement> {
		children?: Snippet<[() => ToastRecord]>;
	}
</script>

<script lang="ts">
	import Element from '../../internal/Element.svelte';
	import Portal from '../../internal/Portal.svelte';
	import { cn } from '../../internal/cn.js';
	import { mergeStyleDeclarations } from '../../internal/mergeProps.js';
	import styles from './Toast.module.css';
	import Toast from './Toast.svelte';
	import ToastActionTrigger from './ToastActionTrigger.svelte';
	import ToastCloseTrigger from './ToastCloseTrigger.svelte';
	import ToastDescription from './ToastDescription.svelte';
	import ToastIcon from './ToastIcon.svelte';
	import ToastItem from './ToastItem.svelte';
	import ToastTitle from './ToastTitle.svelte';
	import ToastValue from './ToastValue.svelte';
	import { useToastGroupContext } from './toast.state.svelte';

	let {
		asChild,
		children,
		class: className,
		'data-slot': dataSlot = 'toast-viewport',
		onblur,
		onfocus,
		onmouseenter,
		onmousemove,
		onmouseleave,
		ref = $bindable(null),
		style,
		...props
	}: ToastViewportProps = $props();

	const api = useToastGroupContext();

	$effect(() => {
		api.setRegionNode(ref as HTMLElement | null);
		return () => api.setRegionNode(null);
	});
</script>

<Portal to={api.portalTarget} disabled={!api.portalled}>
	<Element
		as="div"
		{...props}
		bind:ref
		{asChild}
		id={api.regionId}
		dir={api.dir}
		tabindex={-1}
		role="region"
		aria-label={`${api.label}, ${api.placement} (${api.hotkeyLabel})`}
		aria-live="polite"
		aria-relevant="additions text"
		aria-atomic="false"
		data-scope="toast"
		data-part="group"
		data-placement={api.placement}
		data-side={api.placement.split('-')[0]}
		data-align={api.placement.split('-')[1] ?? 'center'}
		data-slot={dataSlot}
		style={mergeStyleDeclarations(api.groupStyle, style)}
		onmouseenter={(event) => {
			onmouseenter?.(event);
			api.handlePointerEnter();
		}}
		onmousemove={(event) => {
			onmousemove?.(event);
			api.handlePointerEnter();
		}}
		onmouseleave={(event) => {
			onmouseleave?.(event);
			api.handlePointerLeave();
		}}
		onfocus={(event) => {
			onfocus?.(event);
			api.handleFocus(event);
		}}
		onblur={(event) => {
			onblur?.(event);
			api.handleBlur(event);
		}}
		class={cn(styles.toaster, className)}
	>
		{#each api.toasts as record, index (record.id)}
			<ToastItem value={record} {index} group={api}>
				{#if children}
					{@render children(() => record)}
				{:else}
					<Toast>
						{#if record.title != null}
							<ToastTitle>
								{#if record.type === 'loading'}
									<ToastIcon />
								{/if}
								<ToastValue value={record.title} />
							</ToastTitle>
						{/if}
						{#if record.description != null}
							<ToastDescription />
						{/if}
						{#if record.action != null}
							<ToastActionTrigger>{record.action.label}</ToastActionTrigger>
						{/if}
						{#if record.closable !== false}
							<ToastCloseTrigger />
						{/if}
					</Toast>
				{/if}
			</ToastItem>
		{/each}
	</Element>
</Portal>
