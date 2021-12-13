<script>
  import { ModalFooter, Button } from 'sveltestrap';
</script>

<ModalFooter>
  <div class="d-flex w-100 justify-content-between">
    <div>
      <slot name=left></slot>
    </div>
    <div>
      <slot name=right></slot>
      <slot name=close>
        <Button color=primary on:click>
          Sluiten
        </Button>
      </slot>
    </div>
  </div>
</ModalFooter>