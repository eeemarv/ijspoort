<script>
  import Icon from '@iconify/svelte';
  import plusIcon from '@iconify/icons-fa/plus';
  import minusIcon from '@iconify/icons-fa/minus';
  import { TabPane, Card } from 'sveltestrap';
  import { gate_nfc_enabled, gate_nfc_open_time } from '../../services/store';

  export let tab;
</script>

<TabPane tabId=members active={tab === 'members'}>
  <span slot=tab>
    Leden
  </span>
  <Card body>
    <div class=form-check>
      <input class=form-check-input type=checkbox id=nfc_switch bind:checked={$gate_nfc_enabled}>
      <label class=form-check-label for=nfc_switch>
        Toegang enkel voor leden
      </label>
    </div>
  </Card>
  <div class=form-group>
    <label for=gate_nfc_open_time>
      Tijd waarna poort automatisch dichtvalt (sec)
    </label>

    <div class="input-group input-group-lg">
      <input
        type=number
        id=gate_nfc_open_time
        tabindex=0
        class="form-control input-lg"
        bind:value={$gate_nfc_open_time}
        min=0
        max=999
        disabled={!$gate_nfc_enabled}
        on:keypress
      />

      <div class="input-group-append">
        <button
          class="btn btn-info btn-lg"
          type="button"
          on:click={gate_nfc_open_time.dec}
          disabled={!$gate_nfc_enabled}
        >
          <Icon icon={minusIcon} />
        </button>
      </div>

      <div class="input-group-append">
        <button
          class="btn btn-info btn-lg"
          type="button"
          on:click={gate_nfc_open_time.inc}
          disabled={!$gate_nfc_enabled}
        >
          <Icon icon={plusIcon} />
        </button>
      </div>

      <div class="input-group-append">
        <button
          class="btn btn-info btn-lg"
          type="button"
          on:click={() => $gate_nfc_open_time = 8}
          disabled={!$gate_nfc_enabled}
        >
          8
        </button>
      </div>

      <div class="input-group-append">
        <button
          class="btn btn-info btn-lg"
          type="button"
          on:click={() => $gate_nfc_open_time = 10}
          disabled={!$gate_nfc_enabled}
        >
          10
        </button>
      </div>

      <div class="input-group-append">
        <button
          class="btn btn-info btn-lg"
          type="button"
          on:click={() => $gate_nfc_open_time = 12}
          disabled={!$gate_nfc_enabled}
        >
          12
        </button>
      </div>

      <div class="input-group-append">
        <button
            class="btn btn-info btn-lg"
            type="button"
            on:click={() => $gate_nfc_open_time = 14}
            disabled={!$gate_nfc_enabled}
          >
            14
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
