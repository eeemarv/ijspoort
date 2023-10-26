<script>
  import { FormGroup } from "sveltestrap";
  import { Label } from "sveltestrap";

  export let list_length = 10;
  export let label = 'Toon maximaal aantal in lijst';
  export const options = [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000];
</script>

<FormGroup>
  <Label for=list_length>
    {label}
  </Label>
  <select id=list_length bind:value={list_length} class=form-control name=list_length on:change>
    {#each options as o (o)}
      <option>{o}</option>
    {/each}
  </select>
</FormGroup>