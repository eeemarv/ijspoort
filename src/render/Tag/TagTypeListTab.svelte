<script>
  import { TabPane } from 'sveltestrap';
  import TagTypeRow from './TagTypeRow.svelte';
  import { tag_type_sorted_id_ary } from '../services/store';
  import { tag_type_count } from '../services/store';

  import { tag_type_table } from '../services/store';

  export let tab;

  $: tag_type_id_ary = Object.keys($tag_type_table);

</script>

<TabPane tabId=types active={tab === 'type_list'}>
  <span slot=tab title="Tag types">
    Types: {tag_type_id_ary.length}
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
      {#each tag_type_id_ary as type_id(type_id)}
        <TagTypeRow
          {type_id}
          on:edit
        />
      {/each}
    </tbody>
  </table>
</TabPane>
