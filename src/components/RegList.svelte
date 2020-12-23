<script>
    import { Row, Col, ListGroup, ListGroupItem, Badge } from 'sveltestrap';
    import RegItem from './RegItem.svelte';
    import { db_reg } from '../services/db';
    import { onMount } from 'svelte';

    const reg_hours = 5;
    const reg_limit = 500;
    let registrations = [];
    export let blocked_reg;

    const get_key_since = () => {
        let epoch = (new Date()).getTime();
        return 't' + (epoch - (3600000 * reg_hours)).toString();
    }

    const refresh_reg_list = () => {
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
    };

    onMount(() => {
        refresh_reg_list();

        db_reg.changes({
            since: 'now',
            live: true,
            include_docs: true
        }).on('change', (change) => {
            console.log('reg change');
            console.log(change);
            if (change.deleted){
                registrations = registrations.filter((reg) => reg.doc._id !== change.id);
                return;
            }
            change._id = change.id;
            change.doc.newly_add = true;
            registrations = [change, ...registrations];
        }).on('error', (err) => {
            console.log(err);
        });
    });

    setInterval(() => {
        refresh_reg_list();
    }, 900000);
</script>

<Row>
    <Col class=h-100>
        <ListGroup class="list-group-scroll list-group-striped list-group-border-bottom" id="reg_list">
            <ListGroupItem>
                <p><br></p>
            </ListGroupItem>
            {#if blocked_reg}
                <ListGroupItem class=bg-warning>
                    <p>Reeds geregistreerd (binnen 5 minuten)</p>
                    <Badge color=light title="lidnummer">
                        {blocked_reg.person.member_id}
                    </Badge>
                    &nbsp;
                    {blocked_reg.person.firstname}
                    &nbsp;
                    {blocked_reg.person.surname}
                </ListGroupItem>
            {/if}
            {#each registrations as reg, index(reg.doc._id)}
                <RegItem
                regIndex={registrations.length - index}
                reg={reg.doc}
                />
            {/each}
            {#if registrations.length === 0}
                <ListGroupItem class=bg-primary>
                    <p>Nog geen registraties</p>
                </ListGroupItem>
            {/if}
        </ListGroup>
    </Col>
</Row>
