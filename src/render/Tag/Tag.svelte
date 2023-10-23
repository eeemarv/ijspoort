<script>
  export let tag;
</script>

<span
  class="badge bg-{tag?.color} me-2"
  title={tag?.description}
>
  {tag?.text}
</span>
