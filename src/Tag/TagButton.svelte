<script>
  export let tag;
  export let btn_lg = false;
  export let font_size = '1em';
</script>

<button
  type=button
  class="btn btn-{tag.color}"
  class:btn-lg={btn_lg}
  style="--font-size: {font_size};"
  title={tag.description}
  on:click
>
  {tag.text}
</button>

<style>
  button {
   font-size: var(--font-size);
  }
</style>