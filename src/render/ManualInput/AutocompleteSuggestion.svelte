<script>
  import PersonPhone from '../Person/PersonPhone.svelte';
  import PersonTag from '../Person/PersonTag.svelte';
  import Tag from '../Tag/Tag.svelte';
  import { tag_types } from '../services/store';

  export let person;
  export let tags = [];
</script>

<div>
  <div class="d-flex w-100 justify-content-between">
    <div>
      <PersonTag {person} show_member_year />
      {#each tags as t, index (index)}
        <Tag tag={$tag_types[t]} />
      {/each}
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
