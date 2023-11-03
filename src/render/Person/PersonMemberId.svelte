<script>
  import { person_map } from "../services/store";

  export let person_id = undefined;
</script>

<span class="badge bg-secondary" title="lidnummer">
  {$person_map.get(person_id)?.member_id ?? '***'}
</span>

<style>
span {
 font-size: 1em;
}
</style>
