<script>
  import { ListGroup, Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import PersonName from './PersonName.svelte';
  import PersonTag from './PersonTag.svelte';
  import SelectableListGroupItem from '../../render/Common/SelectableListGroupItem.svelte';
  import ModalFooterClose from '../../render/Common/ModalFooterClose.svelte';
  import { person_map } from '../../services/store';
  import { selected_person_id } from '../../services/store';
  import { person_get_ids_by_simular } from '../../db_get/person_get';
  import { person_simular_lang_keys } from '../../db_get/person_get';
  import Await from '../../render/Await/Await.svelte';
  import AwaitError from '../../render/Await/AwaitError.svelte';

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
    $selected_person_id = person_id;
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
            active={p_id === $selected_person_id}
            on:click={handle_select(p_id)}
          >
            <PersonTag person_id={p_id} show_member_year show_tags />
          </SelectableListGroupItem>
        {/each}
      </ListGroup>
    {:catch error}
      <AwaitError {error} />
    {/await}
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
