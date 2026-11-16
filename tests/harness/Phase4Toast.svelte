<script lang="ts">
	import { untrack } from 'svelte';
	import Toast from '../../src/lib/components/toast/Toast.svelte';
	import ToastActionTrigger from '../../src/lib/components/toast/ToastActionTrigger.svelte';
	import ToastCloseTrigger from '../../src/lib/components/toast/ToastCloseTrigger.svelte';
	import ToastDescription from '../../src/lib/components/toast/ToastDescription.svelte';
	import ToastIcon from '../../src/lib/components/toast/ToastIcon.svelte';
	import ToastProgress from '../../src/lib/components/toast/ToastProgress.svelte';
	import ToastTitle from '../../src/lib/components/toast/ToastTitle.svelte';
	import ToastToaster from '../../src/lib/components/toast/ToastToaster.svelte';
	import { createToaster } from '../../src/lib/components/toast/toast.state.svelte';
	import type {
		ToastPlacement,
		ToastStatusChangeDetails
	} from '../../src/lib/components/toast/toast.state.svelte';

	let {
		placement = 'bottom-end' as ToastPlacement,
		overlap = true,
		max = 24,
		gap = 16,
		duration = undefined,
		dir = undefined,
		portalled = true,
		custom = false,
		withIcon = false,
		withProgress = false,
		closable = undefined,
		action = false,
		onStatusChange = undefined
	}: {
		placement?: ToastPlacement;
		overlap?: boolean;
		max?: number;
		gap?: number;
		duration?: number;
		dir?: 'ltr' | 'rtl' | 'auto' | null;
		portalled?: boolean;
		custom?: boolean;
		withIcon?: boolean;
		withProgress?: boolean;
		closable?: boolean;
		action?: boolean;
		onStatusChange?: (details: ToastStatusChangeDetails) => void;
	} = $props();

	// Props are read once on purpose: `createToaster` owns this configuration for its lifetime.
	const toaster = untrack(() => createToaster({
		placement,
		overlap,
		max,
		gap,
		duration,
		removeDelay: 20
	}));
	let actionClicks = $state(0);
	let status = $state('idle');
	let count = $state(0);

	$effect(() => toaster.subscribe(() => {
		count = toaster.getCount();
	}));

	function track(details: ToastStatusChangeDetails) {
		status = details.status;
		onStatusChange?.(details);
	}

	function info() {
		toaster.info({
			title: 'Saved',
			description: 'Your changes are stored.',
			closable,
			onStatusChange: track
		});
	}

	function typed() {
		toaster.success({ title: 'Workspace synced', description: 'Everyone has the new map.' });
	}

	function quick() {
		toaster.info({ title: 'Quick', duration: 60 });
	}

	function withAction() {
		toaster.create({
			title: 'File deleted',
			description: 'The file left the workspace.',
			action: {
				label: 'Undo',
				onClick: () => {
					actionClicks += 1;
				}
			}
		});
	}

	let loadingId = $state('');
	let settlePromise: (() => void) | null = null;

	function startPromise() {
		const pending = new Promise<void>((done) => {
			settlePromise = done;
		});
		const handle = toaster.promise(pending, {
			loading: { title: 'Uploading', description: 'Sending the file.' },
			success: { title: 'Uploaded', description: 'The file is on the server.' }
		});
		loadingId = handle?.id ?? '';
	}

	function updateFirst() {
		const first = toaster.getVisibleToasts()[0];
		if (!first) return;
		toaster.update(first.id, { title: 'Updated in place' });
	}
</script>

{#if custom}
	<ToastToaster {toaster} {dir} {portalled} label="Notifications">
		{#snippet children(toast)}
			<Toast>
				{#if withIcon}
					<ToastIcon />
				{/if}
				<ToastTitle>{toast().title as string}</ToastTitle>
				<ToastDescription>{toast().description as string}</ToastDescription>
				{#if withProgress}
					<ToastProgress />
				{/if}
				<ToastCloseTrigger />
			</Toast>
		{/snippet}
	</ToastToaster>
{:else}
	<ToastToaster {toaster} {dir} {portalled} label="Notifications" />
{/if}

<div>
	<button
		type="button"
		data-testid="info"
		onclick={() => {
			if (action) withAction();
			else info();
		}}>add info</button
	>
	<button
		type="button"
		data-testid="typed"
		onclick={() => {
			typed();
		}}>add success</button
	>
	<button
		type="button"
		data-testid="quick"
		onclick={() => {
			quick();
		}}>add quick</button
	>
	<button
		type="button"
		data-testid="promise"
		onclick={() => {
			startPromise();
		}}>start promise</button
	>
	<button
		type="button"
		data-testid="resolve"
		onclick={() => {
			settlePromise?.();
			settlePromise = null;
		}}>resolve promise</button
	>
	<button
		type="button"
		data-testid="update"
		onclick={() => {
			updateFirst();
		}}>update first</button
	>
	<button
		type="button"
		data-testid="dismiss"
		onclick={() => {
			toaster.dismiss();
		}}>dismiss all</button
	>
</div>

<output data-testid="count">{count}</output>
<output data-testid="status">{status}</output>
<output data-testid="action-clicks">{actionClicks}</output>
<output data-testid="loading-id">{loadingId}</output>
