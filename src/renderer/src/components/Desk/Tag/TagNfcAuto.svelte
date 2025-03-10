<script>
  import Icon from '@iconify/svelte';
  import arrowUpIcon from '@iconify/icons-fa/arrow-up';
  import { desk_nfc_auto_open_person_data_enabled } from '../../../services/store';
  import { desk_tag_types_enabled } from '../../../services/store';
  import { desk_member_period_filter } from '../../../services/store';
  import { Badge } from 'sveltestrap';

  $: tag_enabled_count = Object.values($desk_tag_types_enabled).reduce((acc, v) => {return v ? acc + 1 : acc;}, 0);
</script>

{#if $desk_nfc_auto_open_person_data_enabled && tag_enabled_count && $desk_member_period_filter}
  <div class="card-footer py-2 d-flex w-100 justify-content-end">
    <div title="Vink bovenstaande aan om tag automatisch toe te voegen bij scannen van geldig lidmaatschap {$desk_member_period_filter}">
      Auto creatie
      <Badge color=success title="lidmaatschap in {$desk_member_period_filter}">
        {$desk_member_period_filter}
      </Badge>
      <Icon icon={arrowUpIcon} />
    </div>
  </div>
{/if}
