<script>
  import { TabPane, Card } from 'sveltestrap';
  import { focus_year, assist_import_year } from '../services/store';

  export let tab;
  let select_years = [];

  const update_select_years = () => {
    select_years = [];
    let year_now = (new Date()).getFullYear();
    for(let y = year_now - 5; y < year_now + 2; y++){
      select_years = [...select_years, y];
    }
  };

  $: {
    tab;
    update_select_years();
  }
</script>

<TabPane tabId=year active={tab === 'year'}>
  <span slot=tab>
    Lidjaar
  </span>
  <Card body>
    <div class="form-group">
      <label for=focus_year>
        Focus lidjaar
      </label>

      <div class="input-group input-group-lg">
        <select id=focus_year
          bind:value={$focus_year}
          class="form-control input-lg"
          name=focus_year
        >
          {#each select_years as y (y)}
            <option>{y}</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="form-group">
      <label for=assist_import_year>
        Assist import lidjaar
      </label>

      <div class="input-group input-group-lg">
        <select id=assist_import_year
          bind:value={$assist_import_year}
          class="form-control input-lg"
          name=assist_import_year
        >
          {#each select_years as y (y)}
            <option>{y}</option>
          {/each}
        </select>
      </div>
    </div>
  </Card>
</TabPane>

<style>
label {
  font-size: 1.4em;
}
</style>
