<script>
  export let inline = false;
  export let name;
  export let value;
  export let group;
</script>

<div
  class=form-check
  class:form-check-inline={inline}
>
  <input
    class=form-check-input
    type=radio
    bind:group
    {name}
    id={name + '_' + value}
    {value}
  >
  <label
    class=form-check-label
    for={name + '_' + value}
  >
    <slot></slot>
  </label>
</div>