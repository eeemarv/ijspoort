<script>
  import { member_person_map, person_map } from '../../../services/store';
  import { Badge, Progress } from 'sveltestrap';
  import { Modal, ModalHeader, ModalBody } from 'sveltestrap';
  import ModalFooterClose from '../../Common/ModalFooterClose.svelte';

  export const open_member_period_modal = () => {
    open = true;
  };

  let open = false;

  const toggle = () => {
    open = !open;
  };

  $: max = [...$member_person_map].filter(([k]) => k !== '^').reduce((mx, e) => Math.max(e[1].size, mx), 10);

</script>

<Modal isOpen={open} {toggle} size=xl>
  <ModalHeader {toggle}>
    Ledenaantal per periode
  </ModalHeader>
  <ModalBody>
    {#each [...$member_person_map].filter(([k]) => k !== '^').sort() as [member_period, p_set](member_period)}
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
  <ModalFooterClose on:click={toggle} >
    <div slot=left>
      {$person_map.size} personen in totaal
      {#if $member_person_map.has('^')}
        ,
        <Badge color=warning>
          Geen lid
        </Badge>
        {$member_person_map.get('^').size} personen
      {/if}
    </div>
  </ModalFooterClose>
</Modal>
