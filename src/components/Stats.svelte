<script>
    import { Button, Card, CardGroup, Progress } from 'sveltestrap';
    import { Modal, ModalHeader, ModalBody, ModalFooter } from 'sveltestrap';
    import { db_person, db_remote_person } from '../services/db';
    import { db_remote_reg } from '../services/db';
    import { db_remote_nfc } from '../services/db';
    import { put_design_person_search } from './../services/design_person';
    import { put_design_reg_search } from './../services/design_reg';
    import { put_design_nfc_search } from './../services/design_nfc';
    import { put_design_eid_search } from './../services/design_eid';
    import { onMount } from 'svelte';

    let open = false;
    const toggle = () => {
        open = !open;
    };

    let member_year_count = [];
    let member_max_year_count = 100;
    let member_year_count_2 = [];

    onMount(() => {
        put_design_person_search();
        put_design_reg_search();
        put_design_nfc_search();
        put_design_eid_search();

        db_remote_nfc.info().then((info) => {
            console.log(info);
        }).catch((err) => {
            console.log(err);
        });
        db_remote_reg.info().then((info) => {
            console.log(info);
        }).catch((err) => {
            console.log(err);
        });
        db_remote_person.info().then((info) => {
            console.log(info);
        }).catch((err) => {
            console.log(err);
        });
    });

    const update_member_count = () => {
        db_person.query('search/count_by_member_year', {
            reduce: true,
            group: true
        }).then((res) => {
            console.log('QUERY MEMBER YEARS');
            console.log(res);
            member_year_count = res.rows;
            member_max_year_count = member_year_count.reduce((max, row) => {
                return Math.max(max, row.value);
            }, 0);
            member_year_count_2 = member_year_count.slice(-2);
        }).catch((err) => {
            console.log(err);
        });
    };

    update_member_count();

    db_person.changes({
        since: 'now',
        live: true
    }).on('change', (change) => {
        console.log('member changes (Stats component)');
        console.log(change);
        update_member_count();
    }).on('error', (err) => {
        console.log(err);
    });

</script>

<Modal isOpen={open} {toggle} size=xl>
    <ModalHeader {toggle}>
        Ledenaantal per jaar
    </ModalHeader>
    <ModalBody>
        {#each member_year_count as myc}
            <div class="text-center">
                {myc.key}
            </div>
            <Progress
                color=success
                title="{myc.value} in {myc.key}"
                value={myc.value}
                max={member_max_year_count}
            >
                {myc.value}
            </Progress>
        {/each}
    </ModalBody>
    <ModalFooter>
        <Button color=primary on:click={toggle}>
            Sluiten
        </Button>
    </ModalFooter>
</Modal>

<CardGroup>
    {#each member_year_count_2 as m(m.key)}
    <Card body>
        <div class="d-flex w-100 justify-content-between">
            <div>
                {m.key}
            </div>
            <div>
                <Button
                    size=sm
                    color=success
                    title="aantal leden in {m.key}"
                    on:click={toggle}
                >
                    {m.value}
                </Button>
            </div>
        </div>
    </Card>
    {/each}
</CardGroup>
