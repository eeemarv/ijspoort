<script>
  import PersonName from './PersonName.svelte';
  import PersonMemberId from './PersonMemberId.svelte';
  import PersonPhone from './PersonPhone.svelte';

  export let person;

</script>

<div>
    <div class="d-flex w-100 justify-content-between">
        <div>
            <PersonMemberId member_id={person.member_id} />
            &nbsp;
            <PersonName {person} />
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
