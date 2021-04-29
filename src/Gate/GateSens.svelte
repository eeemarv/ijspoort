<script>
  export let triggered = false;
  export let title;
</script>

<span class="badge mr-2"
  class:badge-success={triggered}
  class:badge-dark={!triggered}
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