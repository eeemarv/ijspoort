<script>
  import { CardFooter, Input } from 'sveltestrap';
  export let reg_auto_enabled = true;
</script>

<CardFooter>
  <Input
    id=reg_auto_enabled
    type=checkbox
    label="Registreer automatisch"
    bind:checked={reg_auto_enabled}
  />
</CardFooter>
