<script>
  import { TabPane, Card } from 'sveltestrap';
  import { gate_nfc_enabled } from '../services/store';

  export let tab;
</script>

<TabPane tabId=members active={tab === 'members'}>
  <span slot=tab>
    Enkel leden
  </span>
  <Card body>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=nfc_switch bind:checked={$gate_nfc_enabled}>
      <label class=form-check-label for=nfc_switch>
        Toegang enkel voor leden
      </label>
    </div>
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
