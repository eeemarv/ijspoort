<script>
  export let color = undefined;
  export let active = false;
  export let clss = undefined;
  export let title = undefined;
</script>

<div class="list-group-item{color ? ' bg-' + color : ''}{clss ? ' ' + clss : ''}"
  class:active
  {title}
>
  <slot />
</div>