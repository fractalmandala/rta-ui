<script lang="ts">
	import { Switch, SwitchControl, SwitchLabel } from '../../lib/index';

	let checked = $state(true);
</script>

<Switch bind:checked>
	<SwitchControl />
	<SwitchLabel>Email notifications</SwitchLabel>
</Switch>
<p>{checked ? 'On' : 'Off'}</p>
