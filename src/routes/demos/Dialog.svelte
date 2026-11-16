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
		DialogTrigger
	} from '../../lib/components/dialog/index';
	import Button from '../../lib/components/button/Button.svelte';
</script>

<Dialog>
	<DialogTrigger>Edit profile</DialogTrigger>
	<DialogBackdrop />
	<DialogPositioner>
		<DialogContent size="md" placement="center">
			<DialogHeader>
				<DialogTitle>Edit profile</DialogTitle>
				<DialogDescription>Update the details shown on your public page.</DialogDescription>
			</DialogHeader>
			<DialogBody>Changes apply as soon as you save.</DialogBody>
			<DialogFooter>
				<DialogCloseTrigger>Cancel</DialogCloseTrigger>
				<Button>Save</Button>
			</DialogFooter>
			<DialogCloseIcon />
		</DialogContent>
	</DialogPositioner>
</Dialog>
