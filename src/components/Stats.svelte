<script>
    import { Badge, Card, CardGroup } from 'sveltestrap';
    import { db_person } from './../services/pouchdb';
    import { put_design_person_search } from './../services/design_person';
    import { put_design_reg_search } from './../services/design_reg';
    import { put_design_nfc_search } from './../services/design_nfc';

    var member_count_2020 = 0;
    var member_count_2021 = 0;

    put_design_person_search();
    put_design_reg_search();
    put_design_nfc_search();

    const update_member_count = () => {
        db_person.query('search/count_members_2020', {
            key: true,
            reduce: true,
            group: true
        }).then(function (res) {
            console.log(res)
            member_count_2020 = res.rows[0].value;
        }).catch(function (err) {
            console.log(err);
        });

        db_person.query('search/count_members_2021', {
            key: true,
            reduce: true,
            group: true
        }).then(function (res) {
            console.log(res)
            member_count_2021 = res.rows[0].value;
        }).catch(function (err) {
            console.log(err);
        });
    };

    update_member_count();

    db_person.changes({
        since: 'now',
        live: true
    }).on('change', (change) => {
        console.log('person changes (Stats component)');
        console.log(change);
        update_member_count();
    }).on('error', (err) => {
        console.log(err);
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
