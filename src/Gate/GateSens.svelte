<script>
  export let triggered = false;
  export let title;
</script>

<span class="badge me-2"
  class:bg-success={triggered}
  class:bg-dark={!triggered}
  {title}
  on:click
>
  <slot></slot>
</span>

<style>
span {
  font-size: 1.3em;
}
</style>