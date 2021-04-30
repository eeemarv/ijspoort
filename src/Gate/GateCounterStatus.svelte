<script>
  import { gate_count } from "../services/store";
</script>

<span>
  {#if $gate_count <= 0}
    VOL
  {:else}
    &nbsp;
  {/if}
</span>

<style>
span {
  font-size: 4em;
  font-weight: bold;
  line-height: 1.05;
}
</style>