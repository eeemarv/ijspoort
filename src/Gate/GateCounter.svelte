<script>
  export let gate_count = 0;
</script>

<span>
  {gate_count.toString().padStart(3, '0') }
</span>

<style>
span {
  font-family: Courier;
  line-height: 1.05;
  font-weight: bold;
  font-size: 14em;
}
</style>