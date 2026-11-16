<script lang="ts">
	import { ProgressLinear, ProgressLinearRange } from '../../src/lib/components/progress-linear/index.js';
	import { QrCode, QrCodeFrame, QrCodeOverlay } from '../../src/lib/components/qr-code/index.js';
</script>

<ProgressLinear value={50} style="height: 3px" data-testid="progress-root">
	<ProgressLinearRange style="width: 12px" data-testid="progress-range" />
</ProgressLinear>

<QrCode value="rta ui">
	<QrCodeFrame>
		<QrCodeOverlay style="left: 0" data-testid="qr-overlay" />
	</QrCodeFrame>
</QrCode>
