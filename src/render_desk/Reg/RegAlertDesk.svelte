<script>
  import { ev_reg } from '../../services/events';
  import PersonTag from '../../render/Person/PersonTag.svelte';
  import { Badge } from 'sveltestrap';

  let timeout_id = undefined;
  const show_time = 3000;
  let person_id = undefined;

  ev_reg.addEventListener('too_fresh', (e) => {
    console.log('---- ev_reg too fresh', e);
    if (typeof e.detail.person_id !== 'string'){
      return;
    }
    clearTimeout(timeout_id);
    timeout_id = setTimeout(() => {
      person_id = undefined;
    }, show_time);
    person_id = e.detail.person_id;
  });
</script>

{#if person_id}
  <li class="list-group-item bg-purple">
    <PersonTag {person_id} show_member_period />
    <Badge color=dark>
      Reeds geregistreerd
    </Badge>
  </li>
{/if}

<style>
li {
  border-bottom:  1px solid lightgrey;
}
</style>
