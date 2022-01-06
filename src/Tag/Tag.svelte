<script>
  export let tag;
  export let pointer = false;
</script>

<span
  class="badge bg-{tag?.color} me-2"
  title={tag?.description}
  style="cursor: {pointer ? 'pointer' : 'default'};"
>
  {tag?.text}
</span>
