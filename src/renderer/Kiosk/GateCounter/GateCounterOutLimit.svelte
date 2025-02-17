<script>
  import { gate_count } from '../../services/store';
</script>

<span>
  {#if $gate_count < 0}
    {$gate_count}
  {/if}
</span>

<style>
span {
  font-size: 2em;
  font-weight: bold;
  line-height: 1.05;
}
</style>