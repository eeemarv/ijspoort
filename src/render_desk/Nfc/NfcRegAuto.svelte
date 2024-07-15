<script>
  import { Input } from 'sveltestrap';
  import { desk_nfc_auto_reg_enabled } from '../../services/store';

</script>

<Input
  id=desk_nfc_auto_reg_enabled
  type=checkbox
  label="Auto registratie"
  bind:checked={$desk_nfc_auto_reg_enabled}
/>
