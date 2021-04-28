<script>
import GateSens from "./GateSens.svelte";

</script>

<GateSens pin=3 reverse=true on:pin_interrupt>
  In
</GateSens>