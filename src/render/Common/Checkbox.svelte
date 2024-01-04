<script>
  export let inline = false;
  export let name;
  export let checked;
  export let title = undefined;
  export let c_class = '';
</script>

<div
  class="form-check{c_class ? ' ' + c_class : ''}"
  class:form-check-inline={inline}
  {title}
>
  <input
    class=form-check-input
    type=checkbox
    {name}
    id={name}
    bind:checked
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