<script lang="ts">
	import {
		PasswordInput,
		PasswordInputField,
		PasswordInputLabel
	} from '../../lib/components/password-input/index';
	import { Field, FieldHelperText } from '../../lib/components/field/index';

	let visible = $state(false);
</script>

<Field id="demo-password">
	<PasswordInput bind:visible name="password">
		<PasswordInputLabel>Password</PasswordInputLabel>
		<PasswordInputField />
	</PasswordInput>
	<FieldHelperText>Use at least 8 characters.</FieldHelperText>
</Field>

<p>Visible: {visible ? 'yes' : 'no'}</p>
