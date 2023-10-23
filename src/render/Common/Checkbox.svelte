<script>
  export let inline = false;
  export let name;
  export let checked;
  export let title = undefined;
</script>

<div
  class=form-check
  class:form-check-inline={inline}
>
  <input
    class=form-check-input
    type=checkbox
    {name}
    id={name}
    bind:checked
    {title}
    on:change
    on:click
  >
  <label
    class=form-check-label
    for={name}
  >
    <slot></slot>
  </label>
</div>