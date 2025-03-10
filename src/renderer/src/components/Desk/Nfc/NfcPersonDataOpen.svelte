<script>
  import { Input } from '@sveltestrap/sveltestrap';
  import { desk_nfc_auto_open_person_data_enabled } from '../../../services/store';

</script>

<div class="list-group-item">
  <Input
    id=desk_nfc_auto_open_person_data_enabled
    type=checkbox
    label="Open persoonsdata"
    bind:checked={$desk_nfc_auto_open_person_data_enabled}
  />
</div>
