<script>
  import PersonPhone from '../Person/PersonPhone.svelte';
  import PersonTag from '../Person/PersonTag.svelte';

  export let person;
</script>

<div>
  <div class="d-flex w-100 justify-content-between">
    <div>
      <PersonTag {person} show_member_year />
    </div>
    <div>
      <PersonPhone {person} />
    </div>
  </div>
  <div class="d-flex w-100 justify-content-between">
    <div>
      {person.address}, {person.address_zipcode} {person.address_municipality}
    </div>
    <div>
      {person.email}
    </div>
  </div>
</div>
