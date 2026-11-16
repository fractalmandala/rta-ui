<script lang="ts">
	import { NativeSelect } from '../../lib/components/native-select/index';

	let fruit = $state('cherry');
	let tags = $state<string[]>(['design']);
</script>

<p>Chosen: {fruit}</p>
<NativeSelect aria-label="Favourite fruit" bind:value={fruit}>
	<option value="apple">Apple</option>
	<option value="banana">Banana</option>
	<option value="cherry">Cherry</option>
</NativeSelect>

<NativeSelect aria-label="Topics" multiple bind:value={tags}>
	<option value="design">Design</option>
	<option value="code">Code</option>
	<option value="writing">Writing</option>
</NativeSelect>
