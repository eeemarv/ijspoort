<script>
  import GateSens from "./GateSens.svelte";

</script>

<GateSens pin=5 reverse=true on:pin_interrupt>
  Uit
</GateSens>