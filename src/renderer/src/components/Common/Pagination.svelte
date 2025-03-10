<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { FormGroup } from '@sveltestrap/sveltestrap';
  import { Label } from '@sveltestrap/sveltestrap';
  import Icon from '@iconify/svelte';
  import angleLeft from '@iconify/icons-fa/angle-left';
  import angleRight from '@iconify/icons-fa/angle-right';

  const dispatch = createEventDispatcher();

  let start_row = 0;
  let end_row = 25;
  let total_rows = 0;
  export let rows_per_page = 25;
  let page_count = 1;
  let current_page = 1;
  export const rows_per_page_options = [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000];

  let current_page_options = [1];

  export const set_total_rows = (t_rows) => {
    total_rows = t_rows;
    current_page = 1;
    calc();
    dispatch_change();
  };

  const calc = () => {
    page_count = Math.ceil(total_rows / rows_per_page);
    current_page_options = [...Array(page_count)].map((v, i) => i + 1);
    start_row =  (current_page -  1) * rows_per_page;
    end_row = current_page === page_count ? total_rows : start_row + rows_per_page;

    console.log('-- ROWS PER PAGE', rows_per_page);
    console.log('-- START ROW', start_row);
    console.log('-- END ROW', end_row);
  };

  const dispatch_change = () => {
    dispatch('change', {
      start_row: start_row,
      end_row: end_row,
      current_page: current_page,
      rows_per_page: rows_per_page
    });
  };

  const handle_current_page_change = () => {
    calc();
    dispatch_change();
  };

  const handle_rows_per_page_change = () => {
    current_page = 1;
    calc();
    dispatch_change();
  };

  const handle_click_prev_page = () => {
    if (current_page > 1){
      current_page -= 1;
    }
    calc();
    dispatch_change();
  };

  const handle_click_next_page = () => {
    if (current_page < page_count){
      current_page += 1;
    }
    calc();
    dispatch_change();
  };

  $: {
    total_rows;
    current_page = 1;
    calc();
    dispatch_change();
  }
</script>

<FormGroup>
  <Label for=list_length>
    Pagina / Aantal per pagina
  </Label>
  <div class="input-group">

    <button
      title="Vorige pagina"
      class="btn btn-outline-white"
      type="button"
      on:click={handle_click_prev_page}
      disabled={current_page <= 1}
    >
      <Icon icon={angleLeft} />
    </button>

    <button
      title="Volgende pagina"
      class="btn btn-outline-white"
      type="button"
      on:click={handle_click_next_page}
      disabled={current_page >= page_count}
    >
      <Icon icon={angleRight} />
    </button>

    <span class="input-group-text" title="Pagina">
      Pag.
    </span>

    <select
      id=current_page
      bind:value={current_page}
      class=form-control
      name=current_page
      on:change={() => {handle_current_page_change();}}>
      <optgroup label="Pagina">
      {#each current_page_options as p (p)}
        <option value={p}>{p}/{page_count}</option>
      {/each}
      </optgroup>
    </select>

    <span class="input-group-text" title="aantal getoonode items per pagina">
      Max/pag
    </span>

    <select
      id=rows_per_page
      bind:value={rows_per_page}
      class=form-control
      name=rows_per_page
      title="Maximum aantal per pagina"
      on:change={() => {handle_rows_per_page_change();}}>
      <optgroup label="Aantal per pagina">
      {#each rows_per_page_options as n (n)}
        <option>{n}</option>
      {/each}
      </optgroup>
    </select>

  </div>

</FormGroup>