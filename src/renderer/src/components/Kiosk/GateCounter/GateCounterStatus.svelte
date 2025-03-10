<script>
  import { gate_count } from '../../../services/store';
</script>

<span>
  {#if $gate_count <= 0}
    VOL
  {/if}
</span>

<style>
span {
  font-size: 3em;
  font-weight: bold;
  line-height: 1.05;
}
</style>