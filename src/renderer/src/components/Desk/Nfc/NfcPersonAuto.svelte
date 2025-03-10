<script>
  import { Input } from 'sveltestrap';
  import { desk_nfc_auto_open_person_data_enabled } from '../../../services/store';

</script>

<Input
  id=desk_nfc_auto_open_person_data_enabled
  type=checkbox
  label="Auto open persoonsdata"
  bind:checked={$desk_nfc_auto_open_person_data_enabled}
/>
