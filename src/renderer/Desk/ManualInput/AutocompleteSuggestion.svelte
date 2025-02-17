<script>
  import PersonPhone from '../Person/PersonPhone.svelte';
  import PersonTag from '../../Person/PersonTag.svelte';
  import { person_map } from '../../services/store';


  export let person_id;

  $: person = $person_map.get(person_id) ?? {};

</script>

<div>
  <div class="d-flex w-100 justify-content-between">
    <div>
      <PersonTag {person_id} show_member_period show_tags />
    </div>
    <div>
      <PersonPhone {person_id} />
    </div>
  </div>
  <div class="d-flex w-100 justify-content-between">
    <div>
      {person?.address}, {person?.address_zipcode} {person?.address_municipality}
    </div>
    <div>
      {person?.email}
    </div>
  </div>
</div>
