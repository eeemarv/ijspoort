<script>
  import { TabPane, Card } from 'sveltestrap';
  import { gate_sound_ok_enabled } from '../../services/store';
  import { gate_sound_error_enabled } from '../../services/store';
  import { gate_beep_enabled } from '../../services/store';

  export let tab;
</script>

<TabPane tabId=sound active={tab === 'sound'}>
  <span slot=tab>
    Geluid
  </span>
  <Card body>
    <h2>Geluid bij scannen</h2>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=gate_beep_enabled bind:checked={$gate_beep_enabled}>
      <label class=form-check-label for=gate_beep_enabled>
        Bieper aan
      </label>
    </div>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=gate_sound_ok_enabled bind:checked={$gate_sound_ok_enabled}>
      <label class=form-check-label for=gate_sound_ok_enabled>
        Geluid "OK" aan
      </label>
    </div>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=gate_sound_error_enabled bind:checked={$gate_sound_error_enabled}>
      <label class=form-check-label for=gate_sound_error_enabled>
        Geluid "Fout" aan
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
