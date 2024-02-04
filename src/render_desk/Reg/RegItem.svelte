<script>
  import { selected_person_id } from '../../services/store';
  import RegTimeTag from './RegTimeTag.svelte';
  import PersonTag from '../../render/Person/PersonTag.svelte';
  import { reg_del } from '../../db_put/reg_put';
  import CountBadge from '../../render/Common/CountBadge.svelte';
  import NfcTag from '../../render/Nfc/NfcTag.svelte';
  import { nfc_uid_to_id } from '../../nfc/nfc_scan';

  export let reg = undefined;
  export let count = undefined;

  let newly_add = false;
  const newly_add_detect_time = 10000;
  const newly_add_show_time = 1500;

  let deleted = false;
  const deleted_show_time = 700

  let selected = false;
  const selected_show_time = 1000;

  const handle_select_reg = () => {
    selected = true;

    setTimeout(() => {
      selected = false
    }, selected_show_time);

    $selected_person_id = reg.person_id;

    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  const handle_remove_reg = (e) => {

    deleted = true;

    setTimeout(() => {
      reg_del(reg);
    }, deleted_show_time);

  };

  if (reg.ts_epoch > ((new Date).getTime() - newly_add_detect_time)){
    newly_add = true;
    setTimeout(() => newly_add = false, newly_add_show_time);
  }

</script>

<li
  on:click={handle_select_reg}
  on:keyup={() => {}}
  class=list-group-item
  class:bg-success={newly_add}
  class:bg-danger={deleted}
  class:bg-primary={selected}
  class:selectable={!newly_add && !deleted && !selected}
>
  <div class="d-flex w-100 justify-content-between">
    <div>
      <div>
        <CountBadge {count} />
        <RegTimeTag {reg} />
        <PersonTag person_id={reg.person_id} show_member_year show_tags />
      </div>
    </div>
    <div>
      <button
        type=button
        color=danger
        class="btn btn-danger"
        on:click|stopPropagation={handle_remove_reg}
      >
        Verwijder
      </button>
    </div>
  </div>
  {#if reg.blocked_nfc_uid_ary}
    <div class=bg-purple>
      {#each reg.blocked_nfc_uid_ary as nfc_uid, index(index)}
        <NfcTag 
          nfc_id={nfc_uid_to_id(nfc_uid)} 
          show_abc_index
        />
      {/each}
    </div>
  {/if}
</li>

<style>
li:nth-child(even) {
  background-color: black;
}
li {
  border-bottom:  1px solid lightgrey;
}
li.selectable:hover{
  background-color: darkblue;
  cursor: pointer;
}
</style>
