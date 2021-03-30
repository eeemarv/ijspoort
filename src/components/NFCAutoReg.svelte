<script>
    import { CardFooter } from 'sveltestrap';
    import { nfc_auto_reg } from './../services/store';
</script>

<CardFooter>
    <div class="custom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input" id="nfc_auto_reg" bind:checked={$nfc_auto_reg}>
        <label class="custom-control-label" for="nfc_auto_reg" title="Registreer automatisch wanneer NFC tag gescand wordt. Vink af voor andere handelingen.">
            Automatische registratie
        </label>
    </div>
</CardFooter>
