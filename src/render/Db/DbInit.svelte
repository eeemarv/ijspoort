<script>
    import { db_remote_person } from '../services/db';
    import { db_remote_reg } from '../services/db';
    import { db_remote_nfc } from '../services/db';
    import { db_remote_gate } from '../services/db';
    import { db_remote_tag } from '../services/db';
    import { put_design_person_search } from './../services/design_person';
    import { put_design_reg_search } from './../services/design_reg';
    import { put_design_nfc_search } from './../services/design_nfc';
    import { put_design_gate_search } from './../services/design_gate';
    import { put_design_tag_search } from './../services/design_tag';
    import { onMount } from 'svelte';

    onMount(() => {
        put_design_person_search();
        put_design_reg_search();
        put_design_nfc_search();
        put_design_gate_search();
        put_design_tag_search();

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
        db_remote_gate.info().then((info) => {
            console.log(info);
        }).catch((err) => {
            console.log(err);
        });
        db_remote_tag.info().then((info) => {
            console.log(info);
        }).catch((err) => {
            console.log(err);
        });
    });
</script>
