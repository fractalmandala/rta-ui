<script lang="ts">
	import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from '../../lib/index';
</script>

<Tabs defaultValue="overview" variant="line">
	<TabsList>
		<TabsTrigger value="overview">Overview</TabsTrigger>
		<TabsTrigger value="api">API</TabsTrigger>
		<TabsTrigger value="a11y" disabled>Accessibility</TabsTrigger>
		<TabsIndicator />
	</TabsList>
	<TabsContent value="overview">Composable parts, zero runtime dependencies.</TabsContent>
	<TabsContent value="api">Every part accepts native element props.</TabsContent>
	<TabsContent value="a11y">Roving tabindex and arrow keys.</TabsContent>
</Tabs>
