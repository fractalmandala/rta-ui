<script lang="ts">
	import {
		Tabs,
		TabsContent,
		TabsIndicator,
		TabsList,
		TabsTrigger
	} from '../../src/lib/components/tabs/index.js';

	let {
		activationMode = undefined,
		defaultValue = undefined,
		loopFocus = undefined,
		onValueChange = undefined,
		orientation = undefined,
		value = undefined
	} = $props();
</script>

<Tabs
	{activationMode}
	{defaultValue}
	{loopFocus}
	{onValueChange}
	{orientation}
	{value}
	size="sm"
	variant="line"
>
	<TabsList aria-label="Sections">
		<TabsTrigger value="one">One</TabsTrigger>
		<TabsTrigger value="two">Two</TabsTrigger>
		<TabsTrigger value="three" disabled>Three</TabsTrigger>
		<TabsIndicator />
	</TabsList>
	<TabsContent value="one">Panel one</TabsContent>
	<TabsContent value="two">Panel two</TabsContent>
	<TabsContent value="three">Panel three</TabsContent>
</Tabs>
