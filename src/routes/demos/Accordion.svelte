<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		AccordionItemContent,
		AccordionItemIndicator,
		AccordionItemTrigger
	} from '../../lib/index';

	const items = [
		{ value: 'a', title: 'Install', body: 'pnpm add rta-ui' },
		{ value: 'b', title: 'Import', body: "import { Button } from 'rta-ui'" },
		{ value: 'c', title: 'Style', body: 'Bring your own CSS or use the shipped modules.' }
	];
</script>

<Accordion defaultValue={['a']}>
	{#each items as item (item.value)}
		<AccordionItem value={item.value}>
			<AccordionItemTrigger>
				{item.title}
				<AccordionItemIndicator />
			</AccordionItemTrigger>
			<AccordionItemContent>{item.body}</AccordionItemContent>
		</AccordionItem>
	{/each}
</Accordion>
