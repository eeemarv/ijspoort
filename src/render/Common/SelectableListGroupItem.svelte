<script>
  import { get_random_str } from '../../services/functions';

  export let active = false;
  export let id = get_random_str(6);
</script>

<div
    class=list-group-item
    class:active
    on:click
    on:keyup={() => {}}
    {id}
>
    <slot></slot>
</div>

<style>
.list-group-item {
    cursor: pointer;
}
.list-group-item:hover {
    background-color: rgb(59, 59, 59);
}
.list-group-item.active:hover {
    background-color: rgb(44, 106, 141);
}
</style>
