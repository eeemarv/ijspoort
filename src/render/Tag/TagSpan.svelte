<script>
  export let tag = undefined;
</script>

{#if tag}
  <span
    class="badge bg-{tag?.color} me-2"
    title={tag?.description}
  >
    {tag?.text}
  </span>
{/if}
