<script>
  import { get_date_str } from '../../services/functions';
  export let ts_epoch = undefined;
  export let title = 'datum';
</script>

<span {title}>
  {get_date_str(ts_epoch)}
</span>