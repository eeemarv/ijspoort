<script>
  import { member_year_person_map } from '../../services/store';
  import { Progress } from 'sveltestrap';
  import { Modal, ModalHeader, ModalBody } from 'sveltestrap';
  import ModalFooterClose from '../../render/Common/ModalFooterClose.svelte';

  export const open_member_year_modal = () => {
    open = true;
  };

  let open = false;

  const toggle = () => {
    open = !open;
  };

  $: max = [...$member_year_person_map.values()].reduce((mx, p_map) => Math.max(p_map.size, mx), 10);

</script>

<Modal isOpen={open} {toggle} size=xl>
  <ModalHeader {toggle}>
    Ledenaantal per jaar
  </ModalHeader>
  <ModalBody>
    {#each [...$member_year_person_map].sort((a, b) => a[0] - b[0]) as [yk, p_map](yk)}
      <div class="text-center">
        { yk.substring(1) }
      </div>
      <Progress
        color=success
        title="{p_map.size} leden in {yk.substring(1)}"
        value={p_map.size}
        {max}
      >
        { p_map.size }
      </Progress>
    {/each}
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
