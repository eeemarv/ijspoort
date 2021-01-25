<script>
  import { Badge } from 'sveltestrap';
  import PersonName from './PersonName.svelte';
  import PersonMemberId from './PersonMemberId.svelte';
  import PersonPhone from './PersonPhone.svelte';

  export let person;
  const year_str = new Date().getFullYear().toString();

</script>

<div>
    <div class="d-flex w-100 justify-content-between">
        <div>
            <PersonMemberId member_id={person.member_id} />
            &nbsp;
            <PersonName {person} />
            {#if person.member_year && person.member_year['y' + year_str]}
                &nbsp;
                <Badge color=success title="lid in {year_str}">
                    {year_str}
                </Badge>
            {/if}
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
