<script>
  import { Button, ListGroup, Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { person } from './../services/store';
  import { db_person } from './../services/db';
  import PersonName from './PersonName.svelte';
  import PersonTag from './PersonTag.svelte';
  import SelectableListGroupItem from '../Common/SelectableListGroupItem.svelte';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';

  let open = false;
  const toggle = () => {
    open = !open;
  };

  export let type;
  let search_key;
  let result_persons = [];

  const lang = {
    name: 'Gelijke naam',
    date_of_birth: 'Gelijke geboortedatum',
    phone_mobile: 'Gelijke GSM nummer',
    phone_home: 'Gelijke telefoon thuis',
    phone_work: 'Gelijke telefoon van het werk',
    email: 'Gelijk email adres',
    email_work: 'Gelijk email adres van het werk',
    address: 'Gelijk adres'
  };

  const handle_select = (prs) => {
    open = false;
    $person = prs;
  };

  const search_func = () => {
    if (typeof $person === 'undefined'){
      result_persons = [];
      return;
    }
    if (type === 'name'){
      search_key = $person.firstname + $person.surname;
    } else {
      search_key = $person[type];
    }
    let search_text = search_key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '');
    if (search_text === ''){
      result_persons = [];
      return;
    }
    db_person.query('search/count_by_' + type, {
      key: search_text,
      include_docs: true,
      reduce: false
    }).then((res) => {
      console.log('person_search_simular ' + type, res);
      let docs = [];
      res.rows.forEach((v) => {
        docs.push(v.doc);
      });
      result_persons = docs;
    }).catch((err) => {
      console.log(err);
    });
  };

  $: if ($person) {
    search_func();
  }
</script>

<div>
<Modal isOpen={open} {toggle} size=xl>
  <ModalHeader {toggle}>
    {lang[type]}:
    {#if type === 'name'}
      <PersonName person={$person} />
    {:else}
      {$person[type]}
    {/if}
  </ModalHeader>
  <ModalBody>
    <ListGroup>
        {#each result_persons as prs(prs._id)}
          <SelectableListGroupItem
            active={prs._id === $person._id}
            on:click={handle_select(prs)}
          >
            <PersonTag person={prs} show_member_year />
          </SelectableListGroupItem>
      {/each}
    </ListGroup>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>

{#if result_persons.length > 1}
<Button
    size=sm
    color=info
    title={lang[type]}
    on:click={toggle}
>
  &gt;&gt;
  {result_persons.length}
</Button>
{/if}
</div>
