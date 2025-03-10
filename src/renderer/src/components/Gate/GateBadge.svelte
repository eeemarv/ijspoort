<script>
  import { gate_open } from '../../services/store';

  export let font_size = '1em';
</script>

<span class="badge me-1"
  style="--font-size: {font_size};"
  class:bg-success={$gate_open}
  class:bg-dark={!$gate_open}
  title="Poortstatus"
  on:click
  on:keyup
  role="button"
  tabindex="-1"
>
  Poort
</span>

<style>
  span {
    font-size: var(--font-size);
  }
  </style>