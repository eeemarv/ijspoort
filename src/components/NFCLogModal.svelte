<script>
    import { Button, ListGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col } from 'sveltestrap';
    import { db_nfc, db_person } from '../services/db';
    import { nfc_uid, person } from './../services/store';
    import NFCTag from './NFCTag.svelte';
    import PersonTag from './PersonTag.svelte';
    import SelectableListGroupItem from './SelectableListGroupItem.svelte';

    let nfc_count = 0;
    let nfcs = [];
    let persons = {};

    let open = false;

    export const toggle = () => (open = !open);

    const update_nfcs = () => {
        const ts_epoch = new Date();

        db_nfc.query('search/count_by_ts_epoch', {
            startkey: ts_epoch.getTime() + 86400000,
            descending: true,
            include_docs: true,
            limit: 10,
            reduce: false
        }).then((res) => {
            console.log('RES ---- +++++ ----');
            console.log(res);
            nfc_count = res.total_rows;
            nfcs = res.rows;
            console.log('nfcs', nfcs);
            let person_keys = [];
            nfcs.forEach((v) => {
                person_keys.push(v.doc.person_id);
            });
            console.log('person_keys', person_keys);
            return db_person.allDocs({
                keys: person_keys,
                include_docs: true
            });
        }).then((res) => {
            console.log('persons (nfcs)');
            console.log(res);
            res.rows.forEach((p) => {
                persons[p.id] = {...p.doc};
            });
        }).catch((err) => {
            console.log(err);
        });
    };

    $: if (open){
        update_nfcs();
    }

    $: if ($nfc_uid || $person){
        open = false;
    }
</script>

<Modal isOpen={open} {toggle} size=xl>
    <ModalHeader {toggle}>
        Geactiveerde NFC tags
    </ModalHeader>
    <ModalBody>
        <Row>
            <Col>
                Totaal: {nfc_count}
                {#if nfc_count > 10}
                    (enkel de laatste 10 worden getoond)
                {/if}
            </Col>
        </Row>
        <Row>
            <Col>
                <ListGroup>
                    {#each nfcs as n}
                        <SelectableListGroupItem
                            active={$person && $person._id === n.doc.person_id}
                            on:click={() => $person = persons[n.doc.person_id]}
                        >
                            <Row>
                                <Col md=6>
                                    <NFCTag nfc={n.doc} />
                                </Col>
                                <Col>
                                    {#if persons[n.doc.person_id]}
                                    <PersonTag person={persons[n.doc.person_id]} show_member_year />
                                    {/if}
                                </Col>
                            </Row>
                        </SelectableListGroupItem>
                    {/each}
                </ListGroup>
            </Col>
        </Row>
        {#if nfc_count === 0}
            <p>
                Nog geen NFC tags geactiveerd.
            </p>
        {/if}
    </ModalBody>
    <ModalFooter>
        <div class="d-flex w-100 justify-content-end">
            <Button color=primary on:click={toggle}>
                Sluiten
            </Button>
        </div>
    </ModalFooter>
</Modal>
