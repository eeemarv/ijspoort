<script>
  import { Input } from 'sveltestrap';
  import { reg_nfc_auto_enabled } from '../services/store';

</script>

<Input
  id=reg_nfc_auto_enabled
  type=checkbox
  label="Auto registratie"
  bind:checked={$reg_nfc_auto_enabled}
/>
