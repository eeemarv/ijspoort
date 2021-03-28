<script>
  import { db_person, db_reg } from '../services/db';
  import { Button, Badge } from 'sveltestrap';
  import { onMount } from 'svelte';
  import { person } from './../services/store';
  import PersonName from './PersonName.svelte';
  import PersonMemberId from './PersonMemberId.svelte';
  import RegTimeTag from './RegTimeTag.svelte';
  import PersonPhone from './PersonPhone.svelte';

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

  const handle_remove_reg = (event) => {
    deleted = true;
    setTimeout(() => {
        console.log(event);
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

<li bind:this={reg_item} class="list-group-item{blocked ? ' bg-warning' : ''}{newly_add ? ' bg-success' : ''}{deleted ? ' bg-danger' : ''}{selected ? ' bg-primary' : ''}">
<div class="d-flex w-100 justify-content-between">
    <dvi>
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
        <PersonMemberId member_id={person_data.member_id} />
        &nbsp;
        <PersonName person={person_data}/>
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
    </dvi>
    <div>
      {#if !blocked}
        <Button color=primary class=mr-1 on:click={handle_select_reg}>
          Selecteer
        </Button>
        <Button color=danger on:click={handle_remove_reg}>
          Verwijder
        </Button>
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
