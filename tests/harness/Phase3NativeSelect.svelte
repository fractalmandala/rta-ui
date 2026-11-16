<script lang="ts">
	import { NativeSelect } from '../../src/lib/components/native-select/index';

	let {
		value = $bindable('b'),
		disabled = false,
		multiple = false,
		onChange
	}: {
		value?: string | string[];
		disabled?: boolean;
		multiple?: boolean;
		onChange?: (next: string | string[]) => void;
	} = $props();
</script>

<NativeSelect bind:value {disabled} {multiple} onchange={() => onChange?.(value)}>
	<option value="a">A</option>
	<option value="b">B</option>
	<option value="c">C</option>
</NativeSelect>
