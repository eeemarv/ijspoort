<script>
  import { put_design } from './../services/put_design';
  import DbPersonTable from './DbPersonTable.svelte';
  import DbNfcTable from './DbNfcTable.svelte';
  import { onMount } from 'svelte';

  put_design();

  onMount(() => {


  });
</script>

<DbPersonTable />
<DbNfcTable />
