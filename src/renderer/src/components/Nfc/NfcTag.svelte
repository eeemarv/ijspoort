<script>
  import { Badge } from '@sveltestrap/sveltestrap';
  import Icon from '@iconify/svelte';
  import banIcon from '@iconify/icons-fa/ban';
  import LocaleDateString from '../Common/LocaleDateString.svelte';
  import { nfc_map } from '../../services/store';
  import { person_nfc_map } from '../../services/store';
  import { get_date_str } from '../../services/functions';
  import { person_id_to_member_id } from '../../person/person_id';

  export let nfc_id;
  export let show_ts_epoch = false;
  export let show_uid = false;
  export let show_uid_type = false;
  /**
   * set either abc_index or fetch_abc_index
   */
  export let abc_index = undefined;
  export let fetch_abc_index = false;

  let nfc = undefined;
  let abc_color = undefined;
  let abc_code = undefined;

  const abc_colors = ['blue', 'pink', 'orange', 'cyan', 'green', 'grey'];

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
      const s = $person_nfc_map.get(nfc.person_id);
      const i = [...s].indexOf(nfc_id);
      abc_index = i === -1 ? undefined : i; // s.size - i - 1;
      set_abc(abc_index);
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
  <div
    class="badge bg-{abc_color ?? 'secondary'} position-relative"
    title="NFC toegangsbadge {nfc.uid}, lidnummer {person_id_to_member_id(nfc.person_id)}"
  >
    {abc_code ?? '-'}
    {#if nfc.blocked}
      <span
        class="position-absolute top-0 start-100 badge bg-danger border border-light blocked"
        title="Geblokkeerd sinds {get_date_str(nfc.block_hs[nfc.block_hs.length - 1].ts_epoch)}"
      >
        <Icon icon={banIcon} />
        <span class="visually-hidden">Geblokkeerde tag</span>
      </span>
    {/if}
  </div>
  {#if show_uid_type}
    <Badge
      color={nfc.uid.length === 14 ? 'accent' : 'cyan'}
      title="toegangsbadge {nfc.uid}"
    >
      NFC-{nfc.uid.length / 2}b
    </Badge>
  {/if}

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
{:else}
  <Badge color=danger title="nfc tag niet (meer) geregistreerd">
    nfc <Icon icon={banIcon} />
  </Badge>
{/if}

<style>
span.blocked{
  font-size: .7em;
  transform: translate(-50%, -.4rem);
}
</style>