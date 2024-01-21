<script>
  import { FormGroup, Label } from "sveltestrap";
  export let days;
</script>

<FormGroup>
  <Label for=days>Periode in dagen</Label>
  <div class="input-group">
    <input type=number
      id=days class=form-control
      bind:value={days}
      min=1 max=3650
    />
  </div>
 </FormGroup>
