<script lang="ts">
	import { Toggle } from '../../lib/index';

	let bold = $state(false);
</script>

<Toggle bind:pressed={bold} variant="outline">
	Bold
</Toggle>
<Toggle pressed>Italic</Toggle>
<Toggle disabled>Underline</Toggle>
