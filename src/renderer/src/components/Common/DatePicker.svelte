<script>
  import { Datepicker } from 'vanillajs-datepicker';
  import { onMount } from 'svelte';
  import { FormGroup, Label } from '@sveltestrap/sveltestrap';

  export let name = 'date';
  export let label = 'Datum';

  let elem;
  let picker;
  let value;

  onMount(() => {
    picker = new Datepicker(elem, {

    });
  });
</script>

<FormGroup>
  <Label for={name}>{label}</Label>
  <div class="input-group">
    <input type=text
      id={name} class=form-control
      bind:this={elem}
      bind:value
    />
  </div>
</FormGroup>
