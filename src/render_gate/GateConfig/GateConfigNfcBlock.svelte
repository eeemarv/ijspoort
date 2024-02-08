<script>
  import { TabPane, Card } from 'sveltestrap';
  import { nfc_gate_auto_block_enabled } from '../../services/store';
  import { nfc_block_enabled } from '../../services/store';

  export let tab;
</script>

<TabPane tabId=auto_block active={tab === 'auto_block'}>
  <span slot=tab>
    NFC blok
  </span>
  <Card body>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=nfc_block_enabled bind:checked={$nfc_block_enabled}>
      <label class=form-check-label for=nfc_block_enabled>
        Pas geblokkeerde NFC tags toe: geen toegang voor lid wanneer de tag geblokkeerd is.
      </label>
    </div>    
    <div class=form-check>
      <input class=form-check-input type=checkbox id=nfc_gate_auto_block_enabled bind:checked={$nfc_gate_auto_block_enabled}>
      <label class=form-check-label for=nfc_gate_auto_block_enabled>
        Blokkeer automatisch andere NFC tags van een persoon bij scannen van een NFC tag.
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
