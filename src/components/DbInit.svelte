<script>
    import { db_remote_person } from '../services/db';
    import { db_remote_reg } from '../services/db';
    import { db_remote_nfc } from '../services/db';
    import { put_design_person_search } from './../services/design_person';
    import { put_design_reg_search } from './../services/design_reg';
    import { put_design_nfc_search } from './../services/design_nfc';
    import { onMount } from 'svelte';

    onMount(() => {
        put_design_person_search();
        put_design_reg_search();
        put_design_nfc_search();

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
</script>
