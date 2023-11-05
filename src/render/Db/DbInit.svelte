<script>
  import { put_design } from './../services/put_design';
  import DbGateMap from './DbGateMap.svelte';
  import DbPersonMap from './DbPersonMap.svelte';
  import DbRegMap from './DbRegMap..svelte';
  import DbNfcMap from './DbNfcMap.svelte';
  import DbTagMap from './DbTagMap.svelte';

  put_design();

</script>

<DbPersonMap />
<DbNfcMap />
<DbRegMap />
<DbTagMap />
<DbGateMap />
