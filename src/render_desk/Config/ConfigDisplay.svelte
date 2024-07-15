<script>
  import { TabPane, Card } from 'sveltestrap';
  import { temperature_card_enabled } from '../../services/store';
  import { desk_gate_card_enabled } from '../../services/store';
  import { desk_tag_card_enabled } from '../../services/store';
  import { desk_nfc_reset_button_enabled } from '../../services/store';
  import { desk_nfc_read_test_button_enabled } from '../../services/store';
  import { desk_reg_delete_buttons_enabled } from '../../services/store';
  import TemperatureCard from '../../render/Common/TemperatureCard.svelte';

  export let tab;
</script>

<TabPane tabId=display active={tab === 'display'}>
  <span slot=tab>
    Weergave
  </span>
  <Card body>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=desk_nfc_read_test_button_enabled bind:checked={$desk_nfc_read_test_button_enabled}>
      <label class=form-check-label for=desk_nfc_read_test_button_enabled>
        Leesknop voor NFC tags
      </label>
    </div>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=desk_nfc_reset_button_enabled bind:checked={$desk_nfc_reset_button_enabled}>
      <label class=form-check-label for=desk_nfc_reset_button_enabled>
        Wisknop voor NFC tags
      </label>
    </div>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=desk_reg_delete_buttons_enabled bind:checked={$desk_reg_delete_buttons_enabled}>
      <label class=form-check-label for=desk_reg_delete_buttons_enabled>
        Verwijder-knoppen voor registraties
      </label>
    </div>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=desk_tag_card_enabled bind:checked={$desk_tag_card_enabled}>
      <label class=form-check-label for=desk_tag_card_enabled>
        Tags
      </label>
    </div>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=desk_gate_card_enabled bind:checked={$desk_gate_card_enabled}>
      <label class=form-check-label for=desk_gate_card_enabled>
        Poort in/uit
      </label>
    </div>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=temperature_card_enabled bind:checked={$temperature_card_enabled}>
      <label class=form-check-label for=temperature_card_enabled>
        Water- en luchttemperatuur
      </label>
    </div>
    <TemperatureCard />
  </Card>
</TabPane>

<style>

input {
  font-weight: bold;
  font-size: 1.1em;
}
label {
  font-size: 1.1em;
}
</style>
