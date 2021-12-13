<script>
  const { ipcRenderer } = window.require('electron');
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { TabContent, TabPane, Card } from 'sveltestrap';
  import { cache_nfc_person } from '../services/store';
  import { focus_year, assist_import_year } from '../services/store';
  import { temp_display_enabled } from '../services/store';
  import { gate_display_enabled } from '../services/store';
  import { tag_display_enabled } from '../services/store';
  import Temperature from '../Common/Temperature.svelte';
  import ModalFooterClose from '../Common/ModalFooterClose.svelte';

  let open = false;
  let tab = 'year';

  $: if (open) {
    tab = 'year';
  }

  ipcRenderer.on('open_config', () => {
    open = true;
  });

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

</script>

<Modal
  isOpen={open}
  {toggle}
  size=xl
>
  <ModalHeader {toggle} color=info>
    <h1>
      Instellingen
    </h1>
  </ModalHeader>
  <ModalBody>
    <TabContent pills on:tab={(e) => tab = e.detail}>
      <TabPane tabId=year active={tab === 'year'}>
        <span slot=tab>
          Lidjaar
        </span>
        <Card body>
          <div class="form-group">
            <label for=focus_year>
              Focus lidjaar
            </label>

            <div class="input-group input-group-lg">
              <input
                type=number
                id=focus_year
                tabindex=0
                class="form-control input-lg"
                bind:value={$focus_year}
              />
            </div>
          </div>
          <div class="form-group">
            <label for=assist_import_year>
              Assist import lidjaar
            </label>

            <div class="input-group input-group-lg">
              <input
                type=number
                id=assist_import_year
                tabindex=0
                class="form-control input-lg"
                bind:value={$assist_import_year}
              />
            </div>
          </div>
        </Card>
      </TabPane>

      <TabPane tabId=display active={tab === 'display'}>
        <span slot=tab>
          Weergave
        </span>
        <Card body>
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
          <Temperature />
        </Card>
      </TabPane>
    </TabContent>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>

<style>

input {
  font-weight: bold;
  font-size: 1.4em;
}
label {
  font-size: 1.4em;
}
</style>
