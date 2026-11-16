<script lang="ts">
	import {
		QrCode,
		QrCodeDownloadTrigger,
		QrCodeFrame,
		QrCodeOverlay,
		QrCodePattern
	} from '../../src/lib/index';

	let {
		value = undefined,
		pixelSize = 5
	}: { value?: string; pixelSize?: number } = $props();
</script>

<QrCode {value} {pixelSize} defaultValue="rta ui">
	<QrCodeFrame>
		<QrCodePattern />
	</QrCodeFrame>
	<QrCodeOverlay>
		<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="rta" />
	</QrCodeOverlay>
	<QrCodeDownloadTrigger fileName="qr.png">Download</QrCodeDownloadTrigger>
</QrCode>
