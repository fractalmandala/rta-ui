<script lang="ts">
	import {
		QrCodeFrame,
		QrCodePattern,
		QrCodeRootProvider,
		createQrCode
	} from '../../src/lib/index';

	let counter = $state(1);
	let dataUrl = $state('');

	const api = createQrCode(
		() => ({
			defaultValue: 'rta ui',
			pixelSize: 4,
			encoding: { ecc: 'M' as const }
		}),
		'harness'
	);
</script>

<QrCodeRootProvider value={api}>
	<QrCodeFrame>
		<QrCodePattern />
	</QrCodeFrame>
</QrCodeRootProvider>

<span data-part="value">{api.value}</span>
<button
	data-testid="next"
	onclick={() => {
		counter += 1;
		api.setValue(`rta ui ${counter}`);
	}}>next</button
>
<button
	data-testid="data-url"
	onclick={async () => {
		dataUrl = await api.getDataUrl('image/svg+xml');
	}}>data url</button
>
<span data-part="data-url">{dataUrl}</span>
