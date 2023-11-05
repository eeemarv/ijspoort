<script>
  import { focus_year } from '../services/store';
  import { person_member_year_count_map } from '../services/store';
  import { Button, CardBody } from 'sveltestrap';
</script>

<CardBody>
  <div>
    <Button
      size=sm
      color=white
      outline
      on:click
    >
      {$person_member_year_count_map.get('y' + $focus_year) ?? '-'}
    </Button>
      leden in
    <Button
        size=sm
        color=success
        title="aantal leden in {$focus_year}"
        on:click
    >
      {$focus_year}
    </Button>
  </div>
</CardBody>
