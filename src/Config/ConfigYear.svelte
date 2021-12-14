<script>
  import { TabPane, Card } from 'sveltestrap';
  import { focus_year, assist_import_year } from '../services/store';

  export let tab;
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
        <input
          type=number
          id=focus_year
          tabindex=0
          class="form-control input-lg"
          bind:value={$focus_year}
        />
      </div>
    </div>
    <div class="form-group">
      <label for=assist_import_year>
        Assist import lidjaar
      </label>

      <div class="input-group input-group-lg">
        <input
          type=number
          id=assist_import_year
          tabindex=0
          class="form-control input-lg"
          bind:value={$assist_import_year}
        />
      </div>
    </div>
  </Card>
</TabPane>

<style>

input {
  font-weight: bold;
  font-size: 1.4em;
}
label {
  font-size: 1.4em;
}
</style>
