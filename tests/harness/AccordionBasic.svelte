<script lang="ts">
  import Accordion from '../../src/lib/components/accordion/Accordion.svelte';
  import AccordionItem from '../../src/lib/components/accordion/AccordionItem.svelte';
  import AccordionItemTrigger from '../../src/lib/components/accordion/AccordionItemTrigger.svelte';
  import AccordionItemContent from '../../src/lib/components/accordion/AccordionItemContent.svelte';
  import AccordionItemIndicator from '../../src/lib/components/accordion/AccordionItemIndicator.svelte';
  import AccordionItemBody from '../../src/lib/components/accordion/AccordionItemBody.svelte';

  let {
    value = undefined,
    defaultValue = undefined,
    multiple = undefined,
    collapsible = undefined,
    orientation = undefined,
    onValueChange = undefined
  } = $props();
</script>

<Accordion {value} {defaultValue} {multiple} {collapsible} {orientation} {onValueChange}>
  <AccordionItem value="one">
    <AccordionItemTrigger>
      First
      <AccordionItemIndicator />
    </AccordionItemTrigger>
    <AccordionItemContent>
      <AccordionItemBody>First copy</AccordionItemBody>
    </AccordionItemContent>
  </AccordionItem>
  <AccordionItem value="two">
    <AccordionItemTrigger>Second</AccordionItemTrigger>
    <AccordionItemContent>Second copy</AccordionItemContent>
  </AccordionItem>
  <AccordionItem value="three" disabled>
    <AccordionItemTrigger>Third</AccordionItemTrigger>
    <AccordionItemContent>Third copy</AccordionItemContent>
  </AccordionItem>
</Accordion>
