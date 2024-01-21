<script>
  import { Badge } from 'sveltestrap';
  import Icon from '@iconify/svelte';
  import banIcon from '@iconify/icons-fa/ban';
  import LocaleDateString from '../Common/LocaleDateString.svelte';
  import { nfc_map } from '../../services/store';
  import { person_nfc_map } from '../../services/store';

  export let nfc_id = undefined;
  export let show_ts_epoch = false;
  export let show_uid = false;
  export let show_abc_index = false;
  export let abc_index = undefined;
  export let fetch_abc_index = false;

  let nfc = undefined;
  let abc_color = undefined;
  let abc_code = undefined;

  const abc_colors = ['blue', 'pink', 'red', 'orange', 'yellow', 'green', 'cyan', 'grey'];

  const set_abc = (abc_index) => {
    if (abc_index === undefined){
      abc_color = undefined;
      abc_code = undefined;
    } else {
      abc_color = abc_colors[abc_index % abc_colors.length];
      abc_code = String.fromCharCode(65 + (abc_index % 26));
    }
  };

  $: if (nfc_id && $nfc_map.has(nfc_id)){
    nfc = $nfc_map.get(nfc_id);
    if (fetch_abc_index){
      let s = $person_nfc_map.get(nfc.person_id);

      console.log('NFC person_id', nfc.person_id);
      console.log('Person nfc Set ', s);

      let i = [...s].indexOf(nfc_id);
      abc_index = i === -1 ? undefined : s.size - i - 1;
      set_abc(abc_index);
      console.log('abc_index', abc_index);
    }
  } else {
    abc_index = undefined;
    nfc = undefined;
  }

  $: if (!fetch_abc_index){
    set_abc(abc_index);
  }
</script>

{#if $nfc_map.has(nfc_id)}
  {#if show_abc_index}
    <Badge color={abc_color ?? 'secondary'}
      title="{abc_color ? 'Rangorde NFC van persoon' : 'NFC tag niet (meer) gelinkt aan persoon'}"
    >
      {abc_code ?? '-'}
    </Badge>
  {/if}
    <Badge
      color={nfc.uid.length === 14 ? 'accent' : 'cyan'}
      title="toegangsbadge {nfc.uid}"
    >
      NFC-{nfc.uid.length / 2}b
    </Badge>
    <Badge 
      color=danger
      title="geblokkeerd sinds "
    >
      <Icon icon={banIcon} color=light />
    </Badge>
  {#if show_uid}
    <Badge
      color={nfc.uid.length === 14 ? 'accent' : 'cyan'}
      title="unieke code van badge"
    >
      {nfc?.uid}
    </Badge>
  {/if}
  {#if show_ts_epoch}
    &nbsp;
    <LocaleDateString ts_epoch={nfc?.ts_epoch} title="datum van activatie" />
  {/if}
{/if}