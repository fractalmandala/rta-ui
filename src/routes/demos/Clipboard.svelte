<script lang="ts">
	import {
		Clipboard,
		ClipboardControl,
		ClipboardIndicator,
		ClipboardInput,
		ClipboardLabel,
		ClipboardTrigger
	} from '../../lib/index';
</script>

<Clipboard defaultValue="https://rta-ui.dev/docs/clipboard">
	<ClipboardLabel>Copy this link</ClipboardLabel>
	<ClipboardControl>
		<ClipboardInput />
		<ClipboardTrigger>
			<ClipboardIndicator />
		</ClipboardTrigger>
	</ClipboardControl>
</Clipboard>
