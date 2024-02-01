<script>
  import GateSens from '../../render/Gate/GateSens.svelte';
  import { gate_open } from '../../services/store';

  export let font_size = '1.2em';

</script>

<span class="badge me-1"
  class:bg-success={$gate_open}
  class:bg-dark={!$gate_open}
  title="Poort status"
  style="font-size: {font_size};"
>
  Poort
</span>

<GateSens font_size={font_size} />

<style>
  span {
    font-size: var(--font-size);
  }
</style>