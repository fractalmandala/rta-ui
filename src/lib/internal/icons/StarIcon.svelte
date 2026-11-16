<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';

	let { ...props }: SVGAttributes<SVGSVGElement> = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width="24"
	height="24"
	viewBox="0 0 24 24"
	fill="currentColor"
	stroke="currentColor"
	stroke-width="1"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	focusable="false"
	{...props}
><path d="M12 2.5l2.9 6.06 6.6.9-4.8 4.62 1.2 6.6L12 17.5l-5.9 3.18 1.2-6.6L2.5 9.46l6.6-.9z" /></svg>
