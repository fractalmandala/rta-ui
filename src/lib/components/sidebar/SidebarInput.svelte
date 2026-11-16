<script module lang="ts">
	import type { InputRootProps } from '../input/Input.svelte';

	export interface SidebarInputProps extends InputRootProps {}
</script>

<script lang="ts">
	import Input from '../input/Input.svelte';
	import { cn } from '../../internal/cn.js';
	import styles from './Sidebar.module.css';

	let {
		class: className,
		ref = $bindable(null),
		value = $bindable(),
		...props
	}: SidebarInputProps = $props();
</script>

<Input {...props} bind:ref bind:value class={cn(styles.input, className)} data-slot="sidebar-input" />
