<script>
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import PersonName from '../../Person/PersonName.svelte';
  import PersonTag from '../../Person/PersonTag.svelte';
  import SelectableListGroupItem from '../../Common/SelectableListGroupItem.svelte';
  import ModalFooterClose from '../../Common/ModalFooterClose.svelte';
  import { person_map } from '../../../services/store';
  import { desk_selected_person_id } from '../../../services/store';
  import { person_get_ids_by_simular } from '../../../db_get/person_get';
  import { person_simular_lang_keys } from '../../../db_get/person_get';
  import Await from '../../Await/Await.svelte';
  import AwaitError from '../../Await/AwaitError.svelte';
  import ListGroup from '../../Common/ListGroup.svelte';

  export let person_id = undefined;

  export const open_simular = (e) => {
    key = e.detail.key;
    search_key = e.detail.search_key;
    group = e.detail.group;
    open = true;
  };

  let group;
  let key;
  let search_key;
  let open = false;

  const toggle = () => {
    open = !open;
  };

  const handle_select = (person_id) => {
    open = false;
    $desk_selected_person_id = person_id;
  };

</script>

<Modal isOpen={open} {toggle} size=xl>
  <ModalHeader {toggle}>
    {person_simular_lang_keys[key]}:
    {#if key === 'name'}
      <PersonName {person_id} />
    {:else if key === 'group'}
      {group}
    {:else}
      {$person_map.get(person_id)[key]}
    {/if}
  </ModalHeader>
  <ModalBody>
    {#await person_get_ids_by_simular(search_key)}
      <Await />
    {:then person_ids}
      <ListGroup>
        {#each person_ids as p_id(p_id)}
          <SelectableListGroupItem
            active={p_id === $desk_selected_person_id}
            on:click={handle_select(p_id)}
            selectable={$person_map.has(p_id)}
          >
            <PersonTag person_id={p_id} show_member_period show_tags />
          </SelectableListGroupItem>
        {/each}
      </ListGroup>
    {:catch error}
      <AwaitError {error} />
    {/await}
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
