<script>
  import { gate_count } from '../../services/store';

  export let font_size = '14em';

  let gate_count_display;

  $: gate_count_display = $gate_count >= 0 ? $gate_count : 0;
</script>

<span style="--font-size: {font_size};">
  {gate_count_display.toString().padStart(3, '0') }
</span>

<style>
span {
  font-family: Courier;
  line-height: 1.05;
  font-weight: bold;
  font-size: var(--font-size);
}
</style>