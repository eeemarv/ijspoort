<script>
    export let person;
</script>

<div>
    <div class="d-flex w-100 justify-content-between">
        <div>
            {person.firstname} {person.surname}
        </div>
        <div>
            { person.phone_mobile }
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
