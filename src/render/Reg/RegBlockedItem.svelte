<script>
  import { Badge } from 'sveltestrap';
  import PersonTag from '../Person/PersonTag.svelte';
  import { reg_block_time } from '../../services/store';

  export let person_id = undefined;

</script>

<li
  class="list-group-item bg-warning"
>
  <div class="d-flex w-100 justify-content-between">
    <div>
      <div>
        <PersonTag {person_id} show_member_year show_tags />
        <Badge color=dark>
          Reeds geregistreerd in laatste {Math.floor($reg_block_time / 60000)} minuten.
        </Badge>
      </div>
    </div>
    <div>
    </div>
  </div>
</li>

<style>
li {
  border-bottom:  1px solid darkgrey;
}
</style>
