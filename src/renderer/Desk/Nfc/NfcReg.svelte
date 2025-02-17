<script>
  import { Input } from 'sveltestrap';
  import { desk_nfc_auto_reg_enabled } from '../../services/store';
  import { member_period_select } from '../../services/store';
  import { members_only_enabled } from '../../services/store';
  import MemberPeriodDropdown from '../../Common/MemberPeriodDropdown.svelte';

  let dropdown_open = false;

</script>

<div class="list-group-item">
  <Input
    id=desk_nfc_auto_reg_enabled
    type=checkbox
    label="Registratie"
    bind:checked={$desk_nfc_auto_reg_enabled}
  />
  <div class=form-check>
    <input class="form-check-input"
      type=checkbox
      id=members_only_enabled
      bind:checked={$members_only_enabled}
      title="Registreer enkel leden in {$member_period_select} als geldig"
    />
    <label class=form-check-label for=members_only_enabled>
      <span>
        geldig in
      </span>
      <MemberPeriodDropdown {dropdown_open}
        bind:member_period={$member_period_select}
        id=members_only_enabled
      />
    </label>
  </div>
</div>
