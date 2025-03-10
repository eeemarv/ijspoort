<script>
  import { Button, Card, FormGroup, FormText, Label, Modal, ModalBody, ModalHeader } from '@sveltestrap/sveltestrap';
  import Icon from '@iconify/svelte';
  import exclamationTriangle from '@iconify/icons-fa/exclamation-triangle';
  import ModalFooterClose from '../../Common/ModalFooterClose.svelte';
  import { desk_member_period_import } from '../../../services/store';
  import { member_person_map } from '../../../services/store';
  import { person_assist_import } from '../../../db_put/person_put';
  import { desk_member_data_update } from '../../../services/store';

  let open = false;
  let file_path = '';

  window.bridge.onMenuMembersImport(() => {
    open = true;
  });

  export const close = () => {
    open = false;
  };

  const toggle = () => {
    open = !open;
  };

  const handle_file_select = () => {
    console.log('import_file.select');
    window.bridge.sendImportFileSelect();
  };

  const handle_import_file = () => {
    const member_period = $desk_member_period_import;
    console.log('handle_import_file');
    if (!file_path){
      console.log('file_path empty');
      return;
    }
    if (!member_period){
      console.log('member_period empty');
      return;
    }
    $desk_member_data_update = true;
    person_assist_import(file_path, member_period);
    open = false;
  };

  window.bridge.onImportFileSelected((selected_file_path) => {
//  ipcRenderer.on('import_file.selected', (ev, selected_file_path) => {
    console.log('import_file.selected', selected_file_path);
    file_path = selected_file_path;
  });

  $: $desk_member_period_import = $desk_member_period_import.replace(/[^a-z0-9-]/g, '');

  $: if (!$desk_member_data_update && !open && !$member_person_map.has($desk_member_period_import)){
    $desk_member_period_import = '';
  }

  $: if (open){
    file_path = '';
  }
  $:file_name = file_path.split(/[\\\/]/).pop();

</script>

<Modal
  isOpen={open}
  {toggle}
  size=xl
>
  <ModalHeader {toggle} color=info>
    <h1>
      Import leden data vanuit Assist voor lidmaatschapsperiode
    </h1>
  </ModalHeader>
  <ModalBody>
    <FormGroup>
      <Label for=desk_member_period_import>Naam lidmaatschapsperiode</Label>
      <div class="input-group">
        <input type=text
          id=desk_member_period_import class=form-control
          bind:value={$desk_member_period_import}
          pattern="[a-z0-9-]*"
        />
      </div>
      <FormText>
        Gebruik enkel cijfers, kleine letters en koppelteken.
        Je kan hier een nieuwe lidmaatschapsperiode aanmaken ofwel
        een bestaande selecteren. Om een bestaande te selecteren
        kan je een knop hieronder klikken.
      </FormText>
    </FormGroup>
    <div class=mb-2>
    {#each [...$member_person_map.keys()].filter((k) => k !== '^').sort() as member_period(member_period)}
      <Button color=success class=me-2
        on:click={() => $desk_member_period_import = member_period}
      >
        {member_period}
      </Button>
    {/each}
    </div>
    <Card body color=primary>
      <FormText>
        <Icon icon={exclamationTriangle} />
        Lidmaatschapperiodes worden steeds alfabetisch
        gerangschikt weergegeven, waarbij letters worden
        voorafgegaan door koppelteken en cijfers.
      </FormText>
    </Card>
    <FormGroup>
      <Label for=import_file>Excel lidmaatschap bestand uit Assist</Label>
      <div class="input-group"
        on:click={handle_file_select}
        on:keydown={() => {}}
        role="button"
        tabindex="0"
      >
        <Button color=primary>
          Selecteer bestand
        </Button>
        <input type=text
          id=import_file class="form-control text-secondary"
          value={file_name}
          disabled
        />
      </div>
      <FormText>
        Ga in Assist naar Leden > Lidmaatschap per lid beheren. Selecteer
        het juiste "Werkjaar" en kies "Alle actieve leden". Klik dan op
        het meest rechtse pictogram boven de tabel, aangeduid met "X" om
        te exporteren naar een Excel bestand. Het bestand kan je hier
        vervolgens importeren. Vergewis je ervan dat de lidmaatschapsperiode
        overeenstemt! Ingeval van fout kan je de lidmaatschapsperiode(s) weer
        wissen en opnieuw de juiste data importeren in de juiste lidmaatschapsperiode(s).
      </FormText>
    </FormGroup>
    <Button color=primary
      disabled={!file_path || !$desk_member_period_import}
      on:click={handle_import_file}
    >
      Importeer
    </Button>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>
