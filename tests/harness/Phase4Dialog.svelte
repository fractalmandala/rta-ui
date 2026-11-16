<script lang="ts">
	import {
		Dialog,
		DialogBackdrop,
		DialogBody,
		DialogCloseIcon,
		DialogCloseTrigger,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogPositioner,
		DialogTitle,
		DialogTrigger,
		type DialogOpenChangeDetails
	} from '../../src/lib/components/dialog/index';

	let {
		ariaLabel = undefined,
		defaultOpen = false,
		lazyMount = true,
		modal = true,
		onOpenChange = undefined,
		portalled = true,
		open = $bindable(undefined),
		showDescription = true,
		showTitle = true,
		unmountOnExit = true
	}: {
		ariaLabel?: string;
		defaultOpen?: boolean;
		lazyMount?: boolean;
		modal?: boolean;
		portalled?: boolean;
		onOpenChange?: (details: DialogOpenChangeDetails) => void;
		open?: boolean;
		showDescription?: boolean;
		showTitle?: boolean;
		unmountOnExit?: boolean;
	} = $props();
</script>

<Dialog
	aria-label={ariaLabel}
	bind:open
	{defaultOpen}
	{lazyMount}
	{modal}
	{portalled}
	{unmountOnExit}
	onOpenChange={(details) => onOpenChange?.(details)}
>
	<DialogTrigger>Open dialog</DialogTrigger>
	<DialogBackdrop />
	<DialogPositioner>
		<DialogContent>
			<DialogHeader>
				{#if showTitle}
					<DialogTitle>Edit profile</DialogTitle>
				{/if}
				{#if showDescription}
					<DialogDescription>Change the details of your profile.</DialogDescription>
				{/if}
			</DialogHeader>
			<DialogBody>
				<input aria-label="Name" value="Amrit" />
			</DialogBody>
			<DialogFooter>
				<DialogCloseTrigger>Cancel</DialogCloseTrigger>
			</DialogFooter>
			<DialogCloseIcon />
		</DialogContent>
	</DialogPositioner>
</Dialog>
