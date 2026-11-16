<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLProps } from '../../internal/types';
	import type { CreateToasterReturn, ToastPortalRef, ToastRecord } from './toast.state.svelte';

	export interface ToasterProps extends Omit<HTMLProps<'div'>, 'id' | 'children'> {
		toaster: CreateToasterReturn;
		children?: Snippet<[() => ToastRecord]>;
		id?: string | null;
		label?: string;
		dir?: 'ltr' | 'rtl' | 'auto' | null;
		portalled?: boolean;
		portalRef?: ToastPortalRef;
	}
</script>

<script lang="ts">
	import ToastViewport from './ToastViewport.svelte';
	import { createToastGroup, setToastGroupContext } from './toast.state.svelte';

	let {
		children,
		dir = undefined,
		id = undefined,
		label = undefined,
		portalRef = undefined,
		portalled = true,
		toaster,
		...props
	}: ToasterProps = $props();

	const uid = $props.id();
	const api = createToastGroup(
		() => ({ store: toaster, dir, id, label, portalled, portalRef }),
		uid
	);
	setToastGroupContext(api);
</script>

<ToastViewport {...props} data-slot="toast-toaster" {children} />
