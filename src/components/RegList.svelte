<script>
    import { Row, Col, ListGroup } from 'sveltestrap';
    import RegItem from './RegItem.svelte';
    import { db_reg } from './../services/pouchdb';

    let registrations = [];

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


</script>

<Row>
    <Col class=h-100>
        <ListGroup class="list-group-scroll list-group-striped list-group-border-bottom" id="reg_list">
            {#each registrations as reg, index}
                <RegItem
                regIndex={registrations.length - index}
                reg={reg}
                on:remove_reg={removeReg}
                on:select_reg />
            {/each}
        </ListGroup>
    </Col>
</Row>
