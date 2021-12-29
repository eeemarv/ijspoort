<script>
  import { TabPane } from 'sveltestrap';
  import TagTypeRow from './TagTypeRow.svelte';
  import { tag_type_sorted_id_ary } from '../services/store';
  import { tag_type_count } from '../services/store';

  export let tab;
</script>

<TabPane tabId=types active={tab === 'types'}>
  <span slot=tab title="Tag types">
    Types: {$tag_type_count}
  </span>
  <h3 class=mt-2>
    Tag types
  </h3>

  <table class=w-100>
    <thead class=text-bold>
      <tr>
        <th>Aan/Uit</th>
        <th>Aantal</th>
        <th>Max/lid</th>
        <th>Omschrijving</th>
        <th>Gecreëerd</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each $tag_type_sorted_id_ary as tid(tid)}
        <TagTypeRow
          tag_type_id={tid}
          on:edit
        />
      {/each}
    </tbody>
  </table>
</TabPane>
