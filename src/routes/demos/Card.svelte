<script lang="ts">
  import {
    Badge,
    Button,
    Card,
    CardAction,
    CardBody,
    CardDescription,
    CardFooter,
    CardHeader,
    CardMedia,
    CardTitle,
  } from '../../lib/index';
</script>

<Card>
  <CardMedia>
    <div class="media"></div>
  </CardMedia>
  <CardHeader>
    <CardTitle>Field notes</CardTitle>
    <CardDescription>Reusable parts, one flat API per family.</CardDescription>
    <CardAction><Badge variant="secondary">new</Badge></CardAction>
  </CardHeader>
  <CardBody>
    <p>Cards compose from a header, a body and a footer, each of which is a plain element.</p>
  </CardBody>
  <CardFooter>
    <Button size="sm">Open</Button>
    <Button size="sm" variant="ghost">Dismiss</Button>
  </CardFooter>
</Card>

<style>
  .media {
    height: 6rem;
    background: linear-gradient(120deg, var(--moduix-accent), transparent);
  }
</style>
