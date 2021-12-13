<script>
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { TabContent, TabPane, Card } from 'sveltestrap';
  import { gate_count, gate_count_enabled, gate_nfc_enabled, cache_nfc_person } from '../services/store';
  import { temp_display_enabled } from '../services/store';
  import Temperature from '../Common/Temperature.svelte';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';

  let open = false;
  let tab = 'nfc_access';

  $: if (open) {
    tab = 'nfc_access';
  }

  export const launch = () => {
    if (!$cache_nfc_person){
      console.log('-- cache_nfc_person not set --');
      return;
    }
    open = true;
  };

  export const close = () => {
    open = false;
  };

  const toggle = () => {
    open = !open;
  };

  const handle_enter_on_gate_count = (e) => {
    if (!e){
      e = window.event;
    }
    if (e.code === 'Enter' || e.key === 'Enter'){
      toggle();
    }
  }
</script>

<Modal
  isOpen={open}
  {toggle}
  size=xl
>
  <ModalHeader {toggle} color=info>
    <h1>
      Poort instellingen
    </h1>
  </ModalHeader>
  <ModalBody>
    <TabContent pills on:tab={(e) => tab = e.detail}>
      <TabPane tabId=nfc_access active={tab === 'nfc_access'}>
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
      <TabPane tabId=max_access active={tab === 'max_access'}>
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
              on:keypress={handle_enter_on_gate_count}
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
      <TabPane tabId=temp_display active={tab === 'temp_display'}>
        <span slot=tab>
          Temperatuur
        </span>
        <Card body>
          <div class=form-check>
            <input class=form-check-input type=checkbox id=temp_display_enabled bind:checked={$temp_display_enabled}>
            <label class=form-check-label for=temp_display_enabled>
              Geef water- en luchttemperatuur weer
            </label>
          </div>
        </Card>
        <Temperature />
      </TabPane>
    </TabContent>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>

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
