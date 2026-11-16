<script lang="ts">
  import {
    Breadcrumbs,
    BreadcrumbsEllipsis,
    BreadcrumbsItem,
    BreadcrumbsLink,
    BreadcrumbsList,
    BreadcrumbsPage,
    BreadcrumbsPath,
    BreadcrumbsSeparator,
  } from '../../lib/index';
</script>

<Breadcrumbs>
  <BreadcrumbsList>
    <BreadcrumbsItem>
      <BreadcrumbsLink href="/">Home</BreadcrumbsLink>
    </BreadcrumbsItem>
    <BreadcrumbsSeparator />
    <BreadcrumbsItem>
      <BreadcrumbsEllipsis />
    </BreadcrumbsItem>
    <BreadcrumbsSeparator />
    <BreadcrumbsItem>
      <BreadcrumbsLink href="/docs">Docs</BreadcrumbsLink>
    </BreadcrumbsItem>
    <BreadcrumbsSeparator />
    <BreadcrumbsItem>
      <BreadcrumbsPage>Components</BreadcrumbsPage>
    </BreadcrumbsItem>
  </BreadcrumbsList>
</Breadcrumbs>

<div class="path">
  <BreadcrumbsPath
    links={[{ href: '/', label: 'Home' }, { href: '/docs', label: 'Docs' }]}
    page="Components"
  />
</div>

<style>
  .path {
    margin-top: 1rem;
  }
</style>
