<script lang="ts">
	import { createSignaturePad, SignaturePadControl, SignaturePadHiddenInput, SignaturePadRootProvider, SignaturePadSegment } from '../../src/lib/components/signature-pad/index';

	let { readOnly = undefined }: { readOnly?: boolean } = $props();

	let paths = $state<string[]>([]);
	let dataUrl = $state('');
	let draws = $state(0);

	const pad = createSignaturePad(
		() => ({
			paths,
			readOnly,
			name: 'signature',
			onDraw(details) {
				paths = details.paths;
				draws += 1;
			}
		}),
		'harness'
	);
</script>

<SignaturePadRootProvider value={pad}>
	<SignaturePadControl>
		<SignaturePadSegment />
	</SignaturePadControl>
	<SignaturePadHiddenInput value={paths.join(' ')} />
</SignaturePadRootProvider>

<button
	data-testid="clear"
	onclick={() => {
		pad.clear();
	}}>clear</button
>
<button
	data-testid="export"
	onclick={async () => {
		dataUrl = await pad.getDataUrl('image/svg+xml');
	}}>export</button
>
<button
	data-testid="export-png"
	onclick={async () => {
		dataUrl = await pad.getDataUrl('image/png', 0.5);
	}}>export png</button
>
<output data-testid="paths">{paths.join(' ')}</output>
<output data-testid="data-url">{dataUrl}</output>
<output data-testid="draws">{draws}</output>
