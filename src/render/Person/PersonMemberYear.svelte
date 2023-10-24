<script>
  import { person_table } from '../services/store';
  import { selected_person_id } from '../services/store';
  import { person, focus_year } from '../services/store';
  import { Button } from 'sveltestrap';

  let member_year_list = [];
  const years_list = 5;

  const update_view = () => {
    member_year_list = [];

    if ($person === undefined){
      return;
    }

    let year = Math.max($focus_year, new Date().getFullYear());

    for (let y = year - years_list + 1; y <= year; y++){
      member_year_list = [...member_year_list, {
        year: y,
        is_member: $person_table[$selected_person_id].member_year && $person_table[$selected_person_id].member_year['y' + y]
      }];
    }
  };

  $: {
    $person_table[$selected_person_id];
    if ($selected_person_id){
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