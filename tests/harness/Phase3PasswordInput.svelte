<script lang="ts">
	import {
		PasswordInput,
		PasswordInputField,
		PasswordInputLabel
	} from '../../src/lib/components/password-input/index';
	import {
		Field,
		FieldErrorText,
		FieldHelperText
	} from '../../src/lib/components/field/index';

	let {
		invalid = false,
		disabled = false,
		required = false,
		readOnly = false,
		visible = $bindable(false),
		onVisibilityChange
	}: {
		invalid?: boolean;
		disabled?: boolean;
		required?: boolean;
		readOnly?: boolean;
		visible?: boolean;
		onVisibilityChange?: (details: { visible: boolean }) => void;
	} = $props();
</script>

<Field id="password" {invalid} {disabled} {required}>
	<PasswordInput
		{invalid}
		{disabled}
		{required}
		{readOnly}
		name="password"
		bind:visible
		{onVisibilityChange}
		aria-describedby="password-helper"
	>
		<PasswordInputLabel>Password</PasswordInputLabel>
		<PasswordInputField />
	</PasswordInput>
	<FieldHelperText id="password-helper">Use at least 8 characters</FieldHelperText>
	<FieldErrorText>Password is required</FieldErrorText>
</Field>
