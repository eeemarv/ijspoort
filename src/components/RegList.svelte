<script>
    import { Row, Col, ListGroup, ListGroupItem } from 'sveltestrap';
    import RegItem from './RegItem.svelte';
    import { db_reg, db_person } from './../services/pouchdb';
    import { person, gate_keeper } from './../services/store';
    import { onMount } from 'svelte';

    const reg_hours = 5;
    const reg_limit = 500;
    let registrations = [];

    const get_key_since = () => {
        let epoch = (new Date()).getTime();
        return 't' + (epoch - (3600000 * reg_hours)).toString();
    }

    async function updateReg(event) {
        const { reg } = event.detail;
        const update = await db.put(reg)
        if (update.ok) {
            await updateRegList()
        }
    }

    async function removeReg(event) {
        const { reg: regToRemove } = event.detail;
        const removal = await db.remove(regToRemove)
        if (removal.ok) {
            registrations = registrations.filter((reg) => {
                return reg._id !== regToRemove._id
            })
        }
    }

    onMount(() => {
        db_reg.allDocs({
            include_docs: true,
            limit: reg_limit,
            endkey: get_key_since(),
            descending: true
        }).then((res) => {
            console.log(res);
            registrations = res.rows;
        }).catch((err) => {
            console.log(err);
        });

        db_reg.changes({
            since: 'now',
            live: true,
            include_docs: true
        }).on('change', (change) => {
            console.log('reg change');
            console.log(change);
            change._id = change.id;
            registrations = [change, ...registrations];
        }).on('error', (err) => {
            console.log(err);
        });
    });

</script>

<Row>
    <Col class=h-100>
        <ListGroup class="list-group-scroll list-group-striped list-group-border-bottom" id="reg_list">
            <ListGroupItem>
                <p><br></p>
            </ListGroupItem>
            {#each registrations as reg, index(reg.doc._id)}
                <RegItem
                regIndex={registrations.length - index}
                reg={reg.doc}
                on:remove_reg={removeReg}/>
            {/each}
            {#if registrations.length === 0}
                <ListGroupItem class=bg-primary>
                    <p>Nog geen registraties</p>
                </ListGroupItem>
            {/if}
        </ListGroup>
    </Col>
</Row>
