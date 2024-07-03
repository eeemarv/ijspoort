<script>
  import { member_person_map } from '../../services/store';
  import { Progress } from 'sveltestrap';
  import { Modal, ModalHeader, ModalBody } from 'sveltestrap';
  import ModalFooterClose from '../../render/Common/ModalFooterClose.svelte';

  export const open_member_period_modal = () => {
    open = true;
  };

  let open = false;

  const toggle = () => {
    open = !open;
  };

  $: max = [...$member_person_map.values()].reduce((mx, p_set) => Math.max(p_set.size, mx), 10);

</script>

<Modal isOpen={open} {toggle} size=xl>
  <ModalHeader {toggle}>
    Ledenaantal per jaar
  </ModalHeader>
  <ModalBody>
    {#each [...$member_person_map].sort((a, b) => a[0] - b[0]) as [member_period, p_set](member_period)}
      <div class="text-center">
        { member_period }
      </div>
      <Progress
        color=success
        title="{p_set.size} leden in {member_period}"
        value={p_set.size}
        {max}
      >
        { p_set.size }
      </Progress>
    {/each}
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
