<script>
  import Icon from '@iconify/svelte';
  import arrowUpIcon from '@iconify/icons-fa/arrow-up';
  import { person_nfc_auto_enabled } from '../../services/store';
  import { tag_types_enabled } from '../../services/store';
  import { focus_year } from '../../services/store';
  import { Badge } from 'sveltestrap';

  $: tag_enabled_count = Object.values($tag_types_enabled).reduce((acc, v) => {return v ? acc + 1 : acc;}, 0);
</script>

{#if $person_nfc_auto_enabled && tag_enabled_count}
  <div class="card-footer py-2 d-flex w-100 justify-content-end">
    <div title="Vink bovenstaande aan om tag automatisch toe te voegen bij scannen van lid in focus jaar {$focus_year}">
      Auto creatie 
      <Badge color=success title="lid in {$focus_year.toString()}">
        {$focus_year.toString()}
      </Badge>
      <Icon icon={arrowUpIcon} />      
    </div>
  </div>
{/if}
