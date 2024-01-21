<script>
  import { TabPane } from 'sveltestrap';
  import TagTypeRow from './TagTypeRow.svelte';
  import { tag_type_map } from '../../services/store';

  export let tab;
  export let updated_id;

</script>

<TabPane tabId=type_list active={tab === 'type_list'}>
  <span slot=tab title="Tag types">
    Types: {$tag_type_map.size}
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
      {#each [...$tag_type_map.keys()].reverse() as type_id(type_id)}
        <TagTypeRow 
          {type_id} 
          on:edit
          bind:updated_id
        />
      {/each}
    </tbody>
  </table>
</TabPane>
