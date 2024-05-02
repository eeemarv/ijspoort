<script>
  import { selected_person_id } from '../services/store';
  import RegTimeTag from './RegTimeTag.svelte';
  import PersonTag from '../Person/PersonTag.svelte';
  import { reg_del } from '../services/reg';
  import CountBadge from '../Common/CountBadge.svelte';
  import { onMount } from 'svelte';

  export let reg = undefined;
  export let count = undefined;

  let newly_add = false;
  const newly_add_detect_time = 120000;
  const newly_add_show_time = 1500;

  let deleted = false;
  const deleted_show_time = 700

  const handle_select_reg = () => {

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

  onMount(() => {
    if (reg.ts_epoch > ((new Date).getTime() - newly_add_detect_time)){
      newly_add = true;
      setTimeout(() => newly_add = false, newly_add_show_time);
    }
  });

  /*
  $: if (reg.ts_epoch > ((new Date).getTime() - newly_add_detect_time)){
    newly_add = true;
    setTimeout(() => newly_add = false, newly_add_show_time);
  }
  */

</script>

<li
  on:click={handle_select_reg}
  on:keyup={() => {}}
  class=list-group-item
  class:bg-success={newly_add}
  class:bg-danger={deleted}
  class:bg-primary={!newly_add && !deleted && $selected_person_id === reg.person_id}
  class:selectable={!newly_add && !deleted && $selected_person_id !== reg.person_id}
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
