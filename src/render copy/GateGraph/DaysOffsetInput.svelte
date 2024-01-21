<script>
  import { FormGroup, Label } from "sveltestrap";
  export let days_offset;
</script>

<FormGroup>
  <Label for=days_offset>Dagen geleden</Label>
  <div class="input-group">
    <input type=number
      id=days_offset class=form-control
      bind:value={days_offset}
      min=1 max=3650
    />
  </div>
 </FormGroup>