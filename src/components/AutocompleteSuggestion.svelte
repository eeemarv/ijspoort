<script>
    export let person;
</script>

<div class="d-flex w-100 justify-content-between">
    <div>
        {person.firstnames} {person.surname}
    </div>
    <div>
        { person.phone_mobile }
    </div>
</div>
<div class="d-flex w-100 justify-content-between">
    <div>
        {person.address_street_and_number}, {person.address_zip} {person.address_municipality}
    </div>
    <div>
        {person.email}
    </div>
</div>
