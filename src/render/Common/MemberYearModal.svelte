<script>
  import { person_member_year_count_map } from '../services/store';
  import { Progress } from 'sveltestrap';
  import { Modal, ModalHeader, ModalBody } from 'sveltestrap';
  import ModalFooterClose from './ModalFooterClose.svelte';

  export const open_member_year_modal = () => {
    open = true;
  };

  let open = false;
  const toggle = () => {
    open = !open;
  };

  let view_ary = [];
  let max = 10;

  $: {
    $person_member_year_count_map;
    view_ary = [];
    max = 10;
    [...$person_member_year_count_map.keys()].sort().forEach((yk) => {
      const member_count = $person_member_year_count_map.get(yk);
      max = max < member_count ? member_count : max;
      view_ary = [...view_ary, {
        member_count: member_count,
        year: parseInt(yk.substring(1)),
      }];
    });
  }

</script>

<Modal isOpen={open} {toggle} size=xl>
  <ModalHeader {toggle}>
    Ledenaantal per jaar
  </ModalHeader>
  <ModalBody>
    {#each view_ary as v(v.year)}
      <div class="text-center">
        {v.year}
      </div>
      <Progress
        color=success
        title="{v.member_count} leden in {v.year}"
        value={v.member_count}
        {max}
      >
        {v.member_count}
      </Progress>
    {/each}
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
