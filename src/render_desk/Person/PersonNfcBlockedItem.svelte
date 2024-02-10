<script>
  import NfcTag from '../../render/Nfc/NfcTag.svelte';
  import { nfc_map } from '../../services/store';
  import { selected_nfc_id } from '../../services/store';
  import SelectableListGroupItem from '../../render/Common/SelectableListGroupItem.svelte';
  import { Button, Popover } from 'sveltestrap';
  import { nfc_deblock } from '../../db_put/nfc_put';

  export let nfc_id;
  export let abc_index;


  const deblock = () => {

    nfc_deblock(nfc_id);
  };

  //$:nfc = $nfc_map.get(nfc_id);
</script>

<SelectableListGroupItem 
  active={$selected_nfc_id === nfc_id}
  id={'blocked_' + nfc_id}
>
  <NfcTag
    {nfc_id}
    {abc_index}
    show_ts_epoch
    show_uid_type
  />
</SelectableListGroupItem>
<Popover
  placement=bottom
  target={'blocked_' + nfc_id}
  hideOnOutsideClick
  dismissible
  trigger=click
>
  <div slot=title>
    Geblokkeerde NFC tag 
    <NfcTag {nfc_id} {abc_index} />   
  </div>
  
  <Button 
    color=warning 
    on:click={deblock}  
  >
    Deblokkeer
  </Button>
</Popover>
