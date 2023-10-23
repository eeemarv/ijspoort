<script>
  import { Card, CardBody } from 'sveltestrap';
  import TagCardHeader from './TagCardHeader.svelte';
  import TagListen from './TagListen.svelte';
  import TagCardList from './TagCardList.svelte';
  import TagNfcAuto from './TagNfcAuto.svelte';
  import TagModal from './TagModal.svelte';

  let open;
  let tab;
</script>

<TagModal bind:open bind:tab/>

<TagListen
  on:new_tag
  on:deleted_tag
  on:new_tag_type
  on:updated_tag_type
  on:deleted_tag_type
/>

<Card class=my-2>
  <TagCardHeader on:click={() => {open = true;}}/>
  <CardBody class=p-0>
    <TagCardList on:open_tag_tab={(e) => {tab = e.detail; open = true;}}/>
  </CardBody>

  <TagNfcAuto />
</Card>
