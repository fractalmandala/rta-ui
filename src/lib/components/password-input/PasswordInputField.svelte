<script module lang="ts">
	import type { PasswordInputControlProps } from './PasswordInputControl.svelte';

	export interface PasswordInputFieldProps
		extends Omit<PasswordInputControlProps, 'asChild' | 'children'> {}
</script>

<script lang="ts">
	import PasswordInputControl from './PasswordInputControl.svelte';
	import PasswordInputIndicator from './PasswordInputIndicator.svelte';
	import PasswordInputInput from './PasswordInputInput.svelte';
	import PasswordInputVisibilityTrigger from './PasswordInputVisibilityTrigger.svelte';

	let { ref = $bindable(null), ...props }: PasswordInputFieldProps = $props();
</script>

<PasswordInputControl {...props} bind:ref>
	<PasswordInputInput />
	<PasswordInputVisibilityTrigger>
		<PasswordInputIndicator />
	</PasswordInputVisibilityTrigger>
</PasswordInputControl>
