<script>
  import { ListGroup, Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import PersonName from './PersonName.svelte';
  import PersonTag from './PersonTag.svelte';
  import SelectableListGroupItem from '../Common/SelectableListGroupItem.svelte';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';

  import { person_map } from '../services/store';
  import { selected_person_id } from '../services/store';
  import { get_person_ids_by_simular } from '../services/person_simular';
  import { person_simular_lang_keys } from '../services/person_simular';

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
    <ListGroup>
        {#await get_person_ids_by_simular(search_key)}
          <p>...data ophalen</p>
        {:then person_ids}
          {#each person_ids as p_id(p_id)}
            <SelectableListGroupItem
              active={p_id === $selected_person_id}
              on:click={handle_select(p_id)}
            >
              <PersonTag person_id={p_id} show_member_year show_tags />
            </SelectableListGroupItem>
          {/each}
        {:catch err}
          <p class=text-danger>{err}</p>
        {/await}
    </ListGroup>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
