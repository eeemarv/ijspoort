<script>
    export let reg;

</script>

<li>
    {#if todo.complete}
      <span class='is-complete'>{todo.text}</span>
      <button on:click={toggleStatus}>❌</button>
    {:else}
      <span>{todo.text}</span>
      <button on:click={toggleStatus}>✔️</button>
    {/if}
    <button on:click={remove}>💥</button>
  </li>
