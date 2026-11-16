<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { PropsFn } from '../../src/lib/internal/types';
	import {
		SignaturePad,
		SignaturePadCanvas,
		SignaturePadClearTrigger,
		SignaturePadControl,
		SignaturePadGuide,
		SignaturePadHiddenInput,
		SignaturePadLabel,
		SignaturePadSegment
	} from '../../src/lib/components/signature-pad/index';

	let {
		clearAsChild = false,
		composite = false,
		disabled = undefined,
		onDraw = undefined,
		onDrawEnd = undefined,
		paths = $bindable(undefined),
		readOnly = undefined
	}: {
		clearAsChild?: boolean;
		composite?: boolean;
		disabled?: boolean;
		onDraw?: (details: { paths: string[]; currentPath: string | null }) => void;
		onDrawEnd?: (details: { paths: string[] }) => void;
		paths?: string[];
		readOnly?: boolean;
	} = $props();
</script>

{#snippet clearAsChildTrigger(merge: PropsFn<'button'>)}
	{@const merged = merge() as HTMLButtonAttributes}
	<button {...merged}>reset</button>
{/snippet}

<SignaturePad {disabled} {onDraw} {onDrawEnd} {readOnly} bind:paths name="signature">
	<SignaturePadLabel>Signature</SignaturePadLabel>
	{#if composite}
		<SignaturePadCanvas />
	{:else}
		<SignaturePadControl>
			<SignaturePadSegment />
			{#if clearAsChild}
				<SignaturePadClearTrigger asChild={clearAsChildTrigger} />
			{:else}
				<SignaturePadClearTrigger />
			{/if}
			<SignaturePadGuide />
		</SignaturePadControl>
	{/if}
	<SignaturePadHiddenInput value={paths?.join(' ') ?? ''} />
</SignaturePad>
