<script>
  import { TabPane, Card } from 'sveltestrap';
  import { sound_ok_enabled } from '../../services/store';
  import { sound_error_enabled } from '../../services/store';
  import { beep_enabled } from '../../services/store';

  export let tab;
</script>

<TabPane tabId=sound active={tab === 'sound'}>
  <span slot=tab>
    Geluid
  </span>
  <Card body>
    <h2>Geluid bij scannen tag</h2>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=beep_enabled bind:checked={$beep_enabled}>
      <label class=form-check-label for=beep_enabled>
        Bieper aan
      </label>
    </div>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=sound_ok_enabled bind:checked={$sound_ok_enabled}>
      <label class=form-check-label for=sound_ok_enabled>
        Geluid "OK" aan
      </label>
    </div>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=sound_error_enabled bind:checked={$sound_error_enabled}>
      <label class=form-check-label for=sound_error_enabled>
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
