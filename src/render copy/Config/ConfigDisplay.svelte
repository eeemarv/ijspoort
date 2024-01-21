<script>
  import { TabPane, Card } from 'sveltestrap';
  import { temp_display_enabled } from '../../services/store';
  import { gate_display_enabled } from '../../services/store';
  import { tag_display_enabled } from '../../services/store';
  import { nfc_reset_enabled } from '../../services/store';
  import { nfc_read_test_enabled } from '../../services/store';
  import TemperatureCard from '../Common/TemperatureCard.svelte';

  export let tab;
</script>

<TabPane tabId=display active={tab === 'display'}>
  <span slot=tab>
    Weergave
  </span>
  <Card body>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=nfc_read_test_enabled bind:checked={$nfc_read_test_enabled}>
      <label class=form-check-label for=nfc_read_test_enabled>
        Leesknop voor NFC tags
      </label>
    </div>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=nfc_reset_enabled bind:checked={$nfc_reset_enabled}>
      <label class=form-check-label for=nfc_reset_enabled>
        Wisknop voor NFC tags
      </label>
    </div>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=tag_display_enabled bind:checked={$tag_display_enabled}>
      <label class=form-check-label for=tag_display_enabled>
        Tags
      </label>
    </div>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=gate_display_enabled bind:checked={$gate_display_enabled}>
      <label class=form-check-label for=gate_display_enabled>
        Poort in/uit
      </label>
    </div>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=temp_display_enabled bind:checked={$temp_display_enabled}>
      <label class=form-check-label for=temp_display_enabled>
        Water- en luchttemperatuur
      </label>
    </div>
    <TemperatureCard />
  </Card>
</TabPane>

<style>

input {
  font-weight: bold;
  font-size: 1.4em;
}
label {
  font-size: 1.4em;
}
</style>
