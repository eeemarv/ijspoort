<script>
  import { person_table } from '../services/store';
  import { focus_year } from '../services/store';
  import { Button } from 'sveltestrap';

  export let person_id = undefined;

  let member_year_list = [];
  const years_list = 5;

  const update_view = () => {
    member_year_list = [];

    if (person_id === undefined){
      return;
    }
    if ($person_table[person_id] === undefined){
      return;
    }

    let year = Math.max($focus_year, new Date().getFullYear());

    for (let y = year - years_list + 1; y <= year; y++){
      member_year_list = [...member_year_list, {
        year: y,
        is_member: $person_table[person_id].member_year && $person_table[person_id].member_year['y' + y]
      }];
    }
  };

  $: {
    $focus_year;
    $person_table;
    person_id;
    if (person_id){
      update_view();
    }
  }

</script>

{#each member_year_list as item(item.year)}
  <Button
    color={item.is_member ? 'success' : 'dark'}
    title="{item.is_member ? 'Lid in' : 'Geen lid in'} {item.year}"
    class=me-2
    on:click
  >
    {item.year}
  </Button>
{/each}