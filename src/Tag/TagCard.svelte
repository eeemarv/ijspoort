<script>
  import { Card, CardBody } from 'sveltestrap';
  import TagCardHeader from './TagCardHeader.svelte';
  import TagListen from './TagListen.svelte';
  import TagCardList from './TagCardList.svelte';

</script>

<TagListen
  on:new_tag
  on:deleted_tag
  on:new_tag_type
  on:updated_tag_type
  on:deleted_tag_type
/>

<Card class=my-2>
  <TagCardHeader />
  <CardBody class=p-0>
    <TagCardList />
  </CardBody>
</Card>
