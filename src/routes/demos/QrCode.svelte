<script lang="ts">
	import { QrCode, QrCodeDownloadTrigger, QrCodeFrame, QrCodePattern } from '../../lib/index';
</script>

<div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: start">
	<QrCode value="https://rta.ui" style="--moduix-qr-code-size: 10rem">
		<QrCodeFrame>
			<QrCodePattern />
		</QrCodeFrame>
		<QrCodeDownloadTrigger fileName="rta-ui-qr">Download</QrCodeDownloadTrigger>
	</QrCode>

	<QrCode value="rta ui — dependency-free Svelte 5" pixelSize={4} style="--moduix-qr-code-size: 10rem">
		<QrCodeFrame>
			<QrCodePattern />
		</QrCodeFrame>
	</QrCode>
</div>
