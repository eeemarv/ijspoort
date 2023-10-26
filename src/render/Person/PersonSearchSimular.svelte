<script>
  import { Button, ListGroup, Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { db_person } from './../services/db';
  import PersonName from './PersonName.svelte';
  import PersonTag from './PersonTag.svelte';
  import SelectableListGroupItem from '../Common/SelectableListGroupItem.svelte';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';

  import { person_table } from './../services/store';
  import { selected_person_id } from './../services/store';

  export let type = undefined;
  export let group = '';
  export let person_id = undefined;

  let open = false;

  const toggle = () => {
    open = !open;
  };

  let search_key;
  let res_person_ids = [];
  let person = undefined;

  const lang = {
    name: 'Gelijke naam',
    date_of_birth: 'Gelijke geboortedatum',
    phone_mobile: 'Gelijke GSM nummer',
    phone_home: 'Gelijke telefoon thuis',
    phone_work: 'Gelijke telefoon van het werk',
    email: 'Gelijk email adres',
    email_work: 'Gelijk email adres van het werk',
    address: 'Gelijk adres',
    group: 'Gelijke werkgroep',
  };

  const handle_select = (person_id) => {
    open = false;
    $selected_person_id = person_id;
  };

  const search_func = () => {
    if (person_id === undefined){
      res_person_ids = [];
      return;
    }

    if ($person_table[person_id] === undefined){
      res_person_ids = [];
      return;
    }

    if (type === 'name'){
      search_key = person.firstname + person.surname;
    } else if (type === 'group'){
      search_key = group;
    } else {
      search_key = person[type];
    }

    let search_text = search_key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');

    if (search_text === ''){
      res_person_ids = [];
      return;
    }

    db_person.query('search/count_by_' + type, {
      key: search_text,
      include_docs: false,
      reduce: false
    }).then((res) => {
      console.log('person_search_simular ' + type, res);
      let ids = [];
      res.rows.forEach((v) => {
        ids.push(v.id);
      });
      res_person_ids = [...ids];
    }).catch((err) => {
      console.log(err);
    });
  };

  $: {
    group;
    if (person_id) {
      person = $person_table[person_id];
      search_func();
    }
  }
</script>

<div>
<Modal isOpen={open} {toggle} size=xl>
  <ModalHeader {toggle}>
    {lang[type]}:
    {#if type === 'name'}
      <PersonName {person_id} />
    {:else if type === 'group'}
      {group}
    {:else}
      {person[type]}
    {/if}
  </ModalHeader>
  <ModalBody>
    <ListGroup>
        {#each res_person_ids as p_id(p_id)}
          <SelectableListGroupItem
            active={p_id === person_id}
            on:click={handle_select(p_id)}
          >
            <PersonTag person_id={p_id} show_member_year show_tags />
          </SelectableListGroupItem>
      {/each}
    </ListGroup>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>

{#if res_person_ids.length > 1}
<Button
    size=sm
    color=info
    title={lang[type]}
    on:click={toggle}
>
  &gt;&gt;
  {res_person_ids.length}
</Button>
{/if}
</div>
