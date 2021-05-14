<script>
  import { CardFooter, Input } from 'sveltestrap';
  import { nfc_auto_reg } from '../services/store';
</script>

<CardFooter>
  <Input
    id=nfc_auto_reg
    type=checkbox
    label="Automatische registratie"
    bind:checked={$nfc_auto_reg}
  />
</CardFooter>
