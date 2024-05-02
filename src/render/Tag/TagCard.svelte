<script>
  import { Card, CardBody } from 'sveltestrap';
  import TagCardHeader from './TagCardHeader.svelte';
  import TagListen from './TagListen.svelte';
  import TagCardList from './TagCardList.svelte';
  import TagNfcAuto from './TagNfcAuto.svelte';
  import TagModal from './TagModal.svelte';

  let open_tab;
</script>

<TagModal bind:open_tab />

<TagListen
  on:new_tag
  on:deleted_tag
  on:new_tag_type
  on:updated_tag_type
  on:deleted_tag_type
/>

<Card class=my-2>
  <TagCardHeader on:click={() => {open_tab('tag_list');}}/>
  <CardBody class=p-0>
    <TagCardList on:open_tag_tab={(e) => {open_tab(e.detail)}}/>
  </CardBody>

  <TagNfcAuto />
</Card>
