<script>
  import { TabPane, Card } from 'sveltestrap';
  import { gate_count, gate_count_enabled } from '../services/store';

  export let tab;
</script>

<TabPane tabId=max active={tab === 'max'}>
  <span slot=tab>
    Maximum aantal
  </span>
  <Card body>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=count_switch bind:checked={$gate_count_enabled}>
      <label class=form-check-label for=count_switch>
        Maximum aantal (teller)
      </label>
    </div>
  </Card>
  <div class=form-group>
    <label for=gate_count>
      Aantal personen nog toegelaten
    </label>

    <div class="input-group input-group-lg">
      <input
        type=number
        id=gate_count
        tabindex=0
        class="form-control input-lg"
        bind:value={$gate_count}
        min=0
        max=999
        disabled={!$gate_count_enabled}
        on:keypress
      />

      <div class="input-group-append">
        <button
          class="btn btn-info btn-lg"
          type="button"
          on:click={gate_count.dec}
          disabled={!$gate_count_enabled}
        >
          -
        </button>
      </div>

      <div class="input-group-append">
        <button
          class="btn btn-info btn-lg"
          type="button"
          on:click={gate_count.inc}
          disabled={!$gate_count_enabled}
        >
          +
        </button>
      </div>

      <div class="input-group-append">
        <button
          class="btn btn-info btn-lg"
          type="button"
          on:click={() => $gate_count = 0}
          disabled={!$gate_count_enabled}
        >
          0
        </button>
      </div>

      <div class="input-group-append">
        <button
          class="btn btn-info btn-lg"
          type="button"
          on:click={() => $gate_count = 20}
          disabled={!$gate_count_enabled}
        >
          20
        </button>
      </div>

      <div class="input-group-append">
        <button
          class="btn btn-info btn-lg"
          type="button"
          on:click={() => $gate_count = 50}
          disabled={!$gate_count_enabled}
        >
          50
        </button>
      </div>

      <div class="input-group-append">
        <button
            class="btn btn-info btn-lg"
            type="button"
            on:click={() => $gate_count = 80}
            disabled={!$gate_count_enabled}
          >
            80
          </button>
        </div>
    </div>
  </div>

</TabPane>

<style>
button {
  font-weight: bold;
  font-size: 1.4em;
  min-width: 3em;
}
input {
  font-weight: bold;
  font-size: 1.4em;
}
label {
  font-size: 1.4em;
}
</style>
