<script>
  import { DateRangePicker } from 'vanillajs-datepicker';
  import { onMount } from 'svelte';
  import { FormGroup } from 'sveltestrap';
  import { Label } from 'sveltestrap';

  let elem;
  let date_range_picker;

  onMount(() => {
    date_range_picker = new DateRangePicker(elem, {

    });
  });

</script>

<FormGroup>
  <Label for=period>
    Periode
  </Label>
  <div
    class="input-group" id=period
    bind:this={elem}
  >
    <input type=text class="input-group" name=start />
    <span class="input-group-text">Tot</span>
    <input type=text class="input-group" name=end />
  </div>

</FormGroup>