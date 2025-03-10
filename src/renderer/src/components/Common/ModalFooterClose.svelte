<script>
  import { ModalFooter } from '@sveltestrap/sveltestrap';
	export let font_size = '1em';
  export let btn_lg = false;
</script>

<ModalFooter>
  <div class="d-flex w-100 justify-content-between">
    <div>
      <slot name=left></slot>
    </div>
    <div>
      <slot name=right></slot>
      <slot name=close>
        <button
          type=button
          class="btn btn-primary"
          class:btn-lg={btn_lg}
          style="--font-size: {font_size};"
          on:click
        >
          Sluiten
        </button>
      </slot>
    </div>
  </div>
</ModalFooter>

<style>
button {
 font-size: var(--font-size);
}
</style>
