<script>
  import { ListGroupItem } from 'sveltestrap';
</script>

<ListGroupItem class="d-flex w-100 justify-content-between py-2">
  <div>
    <slot name=left />
  </div>
  <div>
    <slot name=right />
  </div>
</ListGroupItem>
