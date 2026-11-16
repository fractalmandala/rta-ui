<script lang="ts">
	import {
		Popover,
		PopoverArrow,
		PopoverBody,
		PopoverCloseIcon,
		PopoverCloseTrigger,
		PopoverContent,
		PopoverDescription,
		PopoverFooter,
		PopoverHeader,
		PopoverIndicator,
		PopoverPositioner,
		PopoverTitle,
		PopoverTrigger
	} from '../../lib/components/popover/index';

	let open = $state(false);
</script>

<p>Open: {open ? 'yes' : 'no'}</p>

<Popover bind:open positioning={{ placement: 'bottom-start' }}>
	<PopoverTrigger>
		Notification settings
		<PopoverIndicator>▾</PopoverIndicator>
	</PopoverTrigger>
	<PopoverPositioner>
		<PopoverContent>
			<PopoverArrow />
			<PopoverHeader>
				<PopoverTitle>Emails</PopoverTitle>
				<PopoverDescription>Choose what lands in your inbox.</PopoverDescription>
			</PopoverHeader>
			<PopoverBody>
				<label><input type="checkbox" checked /> Weekly digest</label>
			</PopoverBody>
			<PopoverFooter>
				<PopoverCloseTrigger>Save</PopoverCloseTrigger>
			</PopoverFooter>
			<PopoverCloseIcon />
		</PopoverContent>
	</PopoverPositioner>
</Popover>
