<script>
  import { TabPane, Card } from 'sveltestrap';
  import { temp_display_enabled } from '../../services/store';
  import TemperatureCard from '../../render/Common/TemperatureCard.svelte';

  export let tab;
</script>

<TabPane tabId=temp active={tab === 'temp'}>
  <span slot=tab>
    °C
  </span>
  <Card body>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=temp_display_enabled bind:checked={$temp_display_enabled}>
      <label class=form-check-label for=temp_display_enabled>
        Geef water- en luchttemperatuur weer
      </label>
    </div>
  </Card>
  <TemperatureCard />
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
