<script lang="ts">
	import {
		Clipboard,
		ClipboardControl,
		ClipboardIndicator,
		ClipboardInput,
		ClipboardLabel,
		ClipboardTrigger,
		ClipboardValueText
	} from '../../src/lib/index';

	let { onCopy = undefined, value = undefined }: {
		onCopy?: (details: { value: string }) => void;
		value?: string;
	} = $props();
</script>

<Clipboard {onCopy} {value}>
	<ClipboardLabel>Copy invite link</ClipboardLabel>
	<ClipboardControl>
		<ClipboardInput />
		<ClipboardTrigger>
			<ClipboardIndicator />
		</ClipboardTrigger>
	</ClipboardControl>
	<ClipboardValueText />
</Clipboard>
