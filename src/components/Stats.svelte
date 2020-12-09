<script>
    import { Badge, Card, CardGroup } from 'sveltestrap';
    import { db_person } from './../services/pouchdb';
    import { onMount } from 'svelte';

    var member_count_2020 = 0;
    var member_count_2021 = 0;

    const count_members_2020 = {
        map: function (doc, emit) {
            if (doc._id.startsWith('n0')){
                emit(true);
            }
        },
        reduce: '_count'
    };

    const count_members_2021 = {
        map: function (doc, emit) {
            if (!doc.open_balance.trim().startsWith('-')){
                emit(true);
            }
        },
        reduce: '_count'
    };

    onMount(() => {
        db_person.query(count_members_2020, {
            key: true,
            reduce: true,
            group: true
        }).then(function (res) {
            console.log(res)
            member_count_2020 = res.rows[0].value;
        }).catch(function (err) {
            console.log(err);
        });

        db_person.query(count_members_2021, {
            key: true,
            reduce: true,
            group: true
        }).then(function (res) {
            console.log(res)
            member_count_2021 = res.rows[0].value;
        }).catch(function (err) {
            console.log(err);
        });
    });

</script>

<CardGroup>
    <Card body >
        <div class="d-flex w-100 justify-content-between">
        <div>2020</div>
        <div>
            <Badge color=info title="aantal leden in 2020">
                {member_count_2020}
            </Badge>
        </div>
        </div>
    </Card>
    <Card body>
        <div class="d-flex w-100 justify-content-between">
            <div>2021</div>
            <div>
                <Badge color=info title="aantal leden in 2021">
                    {member_count_2021}
                </Badge>
            </div>
        </div>
    </Card>
</CardGroup>
