<script>
  import Icon from '@iconify/svelte';
  import timesIcon from '@iconify/icons-fa/times';
  import pencilIcon from '@iconify/icons-fa/pencil';
  import { onMount } from 'svelte';
  import { getContext } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { Table } from 'sveltestrap';
  import { Button } from 'sveltestrap';
  import { TabPane } from 'sveltestrap';
  import LocaleDateString from '../Common/LocaleDateString.svelte';
  import Tag from './Tag.svelte';
  import TagEnable from './TagEnableCheckbox.svelte';
  import { tag_types, tag_types_enabled } from '../services/store';

  const { setActiveTab } = getContext('tabContent');
  const dispatch = createEventDispatcher();

  export let tab;
  export let id;

  let tag_type_ary = [];
  let handle_edit;


  onMount(() => {

  });
</script>

<TabPane tabId={id} active={tab === id}>
  <span slot=tab>
    <Tag tag={$tag_types[id]} />
  </span>

  <Table bordered striped hover dark>
    <thead>
      <tr>
        <th>Aan/Uit</th>
        <th>Aantal</th>
        <th>Max/lid</th>
        <th>Gecreëerd</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each tag_type_ary as t(t.ts_epoch)}
        <tr>
          <td>
            <TagEnable tag_id={t._id}>
              <Tag tag={t} />
            </TagEnable>
          </td>
          <td>
            0
          </td>
          <td>
            {t.max_per_person}
          </td>
          <td>
            <LocaleDateString ts={t.ts_epoch} title="datum van aanmaak" />
          </td>
          <td>
            <Button
              color=primary
              title="tag type aanpassen"
              on:click={() => handle_edit(t._id)}
            >
              <Icon icon={pencilIcon} />
            </Button>
          </td>
        </tr>
      {/each}
    </tbody>
  </Table>
</TabPane>
