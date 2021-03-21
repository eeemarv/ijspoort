<script>
    import { onMount } from 'svelte';
    import { Badge } from 'sveltestrap';
    import { db_nfc } from '../services/db';

    let nfc_count = 0;

    const update_nfc_count = () => {
        db_nfc.query('search/count_total', {
            key: true,
            reduce: true,
            group: true
        }).then((res) => {
            console.log(res);
            if (res.rows.length > 0){
                nfc_count = res.rows[0].value;
            } else {
                nfc_count = 0;
            }
        }).catch((err) => {
            console.log(err);
        });
    };

    onMount(() => {
        update_nfc_count();
    });

    db_nfc.changes({
        since: 'now',
        live: true
    }).on('change', (change) => {
        console.log('nfc changes (NFC component)');
        console.log(change);
        update_nfc_count();
    }).on('error', (err) => {
        console.log(err);
    });

</script>

<Badge color=info title="Totaal aantal NFC-tags geregistreerd">
    {nfc_count}
</Badge>
