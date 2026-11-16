<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';

  let { strokeWidth = 3, ...props }: SVGAttributes<SVGSVGElement> & { strokeWidth?: number } = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
  focusable="false"
  {...props}
><path d="m6 9 6 6 6-6" /></svg>
