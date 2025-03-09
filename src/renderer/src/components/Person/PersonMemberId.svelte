<script>
  import { person_id_to_member_id } from '../person/person_id';

  export let person_id = undefined;
</script>

<span class="badge bg-secondary" title="lidnummer">
  {person_id_to_member_id(person_id)}
</span>

<style>
span {
 font-size: 1em;
}
</style>
