<script>
  import { Card, CardBody } from '@sveltestrap/sveltestrap';
  import TagCardHeader from './TagCardHeader.svelte';
  import TagCardList from './TagCardList.svelte';
  import TagNfcAuto from './TagNfcAuto.svelte';
  import TagModal from '../TagModal/TagModal.svelte';

  let open;
  let tab;
</script>

<TagModal bind:open bind:tab/>

<Card class=my-2>
  <TagCardHeader on:click={() => {tab = 'type_list'; open = true;}}/>
  <CardBody class=p-0>
    <TagCardList on:open_tag_tab={(e) => {tab = e.detail; open = true;}}/>
  </CardBody>
  <TagNfcAuto />
</Card>
