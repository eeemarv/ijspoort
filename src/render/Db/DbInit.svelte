<script>
  import { put_design } from './../services/put_design';
  import DbPersonTable from './DbPersonTable.svelte';
  import DbNfcTable from './DbNfcTable.svelte';
  import DbTagTable from './DbTagTable.svelte';

  put_design();

</script>

<DbPersonTable />
<DbNfcTable />
<DbTagTable />
