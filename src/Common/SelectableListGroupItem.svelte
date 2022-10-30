<script>
  export let active = false;
</script>

<div
    class="list-group-item{active ? ' active' : ''}"
    on:click
    on:keyup={() => {}}
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
