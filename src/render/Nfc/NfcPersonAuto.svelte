<script>
  import { Input } from 'sveltestrap';
  import { person_nfc_auto_enabled } from '../../services/store';

</script>

<Input
  id=person_nfc_auto_enabled
  type=checkbox
  label="Auto open persoonsdata"
  bind:checked={$person_nfc_auto_enabled}
/>
