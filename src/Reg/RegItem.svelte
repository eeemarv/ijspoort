<script>
  import { db_person, db_reg } from '../services/db';
  import { Button, Badge } from 'sveltestrap';
  import { onMount } from 'svelte';
  import { person } from '../services/store';
  import RegTimeTag from './RegTimeTag.svelte';
  import PersonPhone from '../Person/PersonPhone.svelte';
  import PersonTag from '../Person/PersonTag.svelte';

  export let reg_index;
  export let reg;
  export let newly_add = true;
  export let blocked = false;
  export let block_time = 300000;

  const scan_previous_hours = 5;
  let reg_item;
  let deleted = false;
  let selected = false;
  let person_data = {};
  let previous_regs = [];

  const get_scan_since = () => {
    let epoch = (new Date()).getTime();
    return (epoch - (3600000 * scan_previous_hours)).toString();
  }

  const handle_select_reg = () => {
    selected = true;
    setTimeout(() => {selected = false}, 1000);
    db_person.get(reg.person_id).then((res) => {
        $person = res;
    }).catch((err) => {
        console.log(err);
    });
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  const handle_remove_reg = (e) => {
    deleted = true;
    setTimeout(() => {
      db_reg.remove(reg).then((res) => {
        console.log(res);
        $person = undefined;
      }).catch((err) => {
        console.log(err);
      });
    }, 500);
  };

  onMount(() => {
    db_person.get(reg.person_id).then((res) => {
      console.log('mount reg, get person data');
      person_data = res;
    }).catch((err) => {
      console.log(err);
    });

    db_reg.query('search/count_by_person_id_and_ts_epoch', {
      startkey: reg.person_id + '_' + get_scan_since(),
      endkey: reg.person_id + '_\uffff',
      include_docs: true,
      reduce: false
    }).then((res) => {
      console.log('search/count_by_person_id_and_ts_epoch (no reduce)');
      console.log(res);
      previous_regs = res.rows;
    }).catch((err) => {
      console.log(err);
    });

    if (blocked){
      newly_add = false;
      setTimeout(() => {
        reg_item.parentNode.removeChild(reg_item);
      }, 1500);
    }
    setTimeout(() => {
      newly_add = false;
    }, 1000);
  });
</script>

<li
  bind:this={reg_item}
  on:click={handle_select_reg}
  class=list-group-item
  class:bg-warning={blocked}
  class:bg-success={newly_add}
  class:bg-danger={deleted}
  class:bg-primary={selected}
  class:selectable={!blocked && !newly_add && !deleted && !selected}
>
  <div class="d-flex w-100 justify-content-between">
    <div>
      <div>
        {#if reg_index}
          <Badge color=info title="teller">
            {reg_index}
          </Badge>
          &nbsp;
        {/if}
        {#if !blocked}
          <RegTimeTag {reg} />
          &nbsp;
        {/if}
        <PersonTag person={person_data} />
        {#if blocked}
          &nbsp;
          <Badge color=dark>
            Reeds geregistreerd in laatste {Math.floor(block_time / 60000)} minuten.
          </Badge>
        {/if}
      </div>
      <div class="d-flex w-100 justify-content-between mb-0">
        <div>
          <PersonPhone person={person_data} />
        </div>
      </div>
    </div>
    <div>
      {#if !blocked}
        <button
          type=button
          color=danger
          class="btn btn-danger"
          on:click|stopPropagation={handle_remove_reg}
        >
          Verwijder
        </button>
      {/if}
    </div>
  </div>
  {#if false}
  <div>
    {#if previous_regs}
    Ook om:&nbsp;
  {/if}
  {#each previous_regs as prev}
    <RegTimeTag reg={prev.doc} />
    &nbsp;
  {/each}
  <Button color=info>Reg-Info</Button>
  </div>
  {/if}
</li>

<style>
li:nth-child(even) {
  background-color: black;
}
li {
  border-bottom:  1px solid darkgrey;
}
li.selectable:hover{
  background-color: darkblue;
  cursor: pointer;
}
</style>
