<script>
    const env = window.require('electron').remote.process.env;
    const { ipcRenderer } = window.require('electron');
    import { Button, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col } from 'sveltestrap';
    import { db_reg, db_person } from '../services/db';
    import { download } from '../services/download';
    import Papa from 'papaparse';

    const period_in_days = 30;
    let btn_cols = [];
    let persons = {};

    let open = false;
    const toggle = () => {
        open = !open
    };

    ipcRenderer.on('reg.csv.export', () => {
        open = true
    });

    const update_download_buttons = () => {
        let ts_date = new Date(Date.now() - (86400000 * period_in_days));
        let year = ts_date.getFullYear().toString();
        let month = (ts_date.getMonth() + 1).toString().padStart(2, '0');
        let date = ts_date.getDate().toString().padStart(2, '0');
        let key_date = year + '-' + month + '-' + date;
        db_reg.query('search/count_by_date', {
            startkey: key_date,
            reduce: true,
            group: true
        }).then((res) => {
            console.log(res);
            let download_buttons = res.rows;
            let col_size = Math.ceil(download_buttons.length / 3);
            btn_cols = [];
            while (download_buttons.length){
                btn_cols = [...btn_cols, download_buttons.splice(0, col_size)];
            }
        }).catch((err) => {
            console.log(err);
        });
    };

    $: {
        open;
        update_download_buttons();
    }

    const handle_export = (date_key) => {
        let exp = {
            fields:['tijdstip', 'naam', 'tel', 'e-mail'],
            data:[]
        };
        db_person.allDocs({
            include_docs: true
        }).then((res) => {
            res.rows.forEach((v) => {
                persons[v.id] = v.doc;
            });
            return db_reg.query('search/count_by_date', {
                key: date_key,
                include_docs: true,
                reduce: false
            });
        }).then((res) => {
            console.log(res.rows);
            res.rows.forEach((v) => {
                let ts_date = new Date(v.doc.ts_epoch);
                let p = persons[v.doc.person_id];
                let h = ts_date.getHours().toString().padStart(2, '0');
                let m = ts_date.getMinutes().toString().padStart(2, '0');
                let d = [];
                d.push(h + ':' + m);
                d.push(p.firstname + ' ' + p.surname);
                let tel = p.phone_mobile || p.phone_home || p.phone_work;
                d.push(tel);
                d.push(p.email || p.email_work);
                exp.data.push(d);
            });
            return Papa.unparse(exp);
        }).then((csv) => {
            download(csv,
                env.DB_LOCAL_PREFIX + 'reg_' + date_key + '.csv',
                'test/csv'
            );
            open = false;
        }).catch((err) => {
            console.log(err);
        });
    };
</script>

<Modal isOpen={open} {toggle} size=xl>
    <ModalHeader {toggle}>
        Export registraties per dag (Covid-19 tracing)
    </ModalHeader>
    <ModalBody>
        <Row>
            {#each btn_cols as col}
            <Col>
                <ListGroup>
                    {#each col as btn}
                        <ListGroupItem>
                        <Button color=info on:click={() => {handle_export(btn.key)}}>
                            {btn.key} ({btn.value})
                        </Button>
                        </ListGroupItem>
                    {/each}
                </ListGroup>
            </Col>
            {/each}
        </Row>
        {#if btn_cols.length === 0}
        <p>
            Geen registraties de laatste {period_in_days} dagen.
        </p>
        {/if}
    </ModalBody>
    <ModalFooter>
        <Button color=primary on:click={toggle}>
            Sluiten
        </Button>
    </ModalFooter>
</Modal>