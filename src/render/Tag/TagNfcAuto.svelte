<script>
  import { tag_add } from '../services/tag';
  import { tag_nfc_auto_enabled } from '../services/store';
  import { selected_person_id } from '../services/store';
  import { person_nfc_auto_enabled } from '../services/store';
  import { person_map } from '../services/store';
  import { tag_type_enabled_sorted_id_ary } from '../services/store';
  import { tag_person_count_by_type } from '../services/store';
  import { tag_types } from '../services/store';
  import { nfc_uid } from '../services/store';
  import { focus_year } from '../services/store';
  import { CardFooter, Badge } from 'sveltestrap';
  import Checkbox from '../Common/Checkbox.svelte';

  let hold = false;

  const tags_add = () => {
    if (!$tag_nfc_auto_enabled){
      console.log('tags_add > tag_nfc_auto not enabled');
      return;
    }

    const person = $person_map.get($selected_person_id) ?? {};

    if (!person.member_year
      || !person.member_year['y' + $focus_year]){
      console.log('tags_add > not focus year');
      return;
    }

    if (!$nfc_uid){
      console.log('tags_add > no nfc_uid set');
      return;
    }

    if (hold){
      console.log('tags_add hold');
      return;
    }
    setTimeout(() => { hold = false }, 500);
    hold = true;

    setTimeout(() => {
      let add_type_ids = [];
      let t_enabled_ary = $tag_type_enabled_sorted_id_ary;
      let t_types = $tag_types;
      let t_person_count_by_type = $tag_person_count_by_type;

      console.log('tags_add tag_type_enabled_sorted_id_ary');
      console.log(t_enabled_ary);
      console.log('tags_add tag_person_count_by_type')
      console.log(t_person_count_by_type);
      console.log('tags_add tag_types');
      console.log(t_types);

      t_enabled_ary.forEach((id) => {
        let max = 0;
        let count = 0;
        if (t_types[id] && t_types[id].max_per_person){
          max = t_types[id].max_per_person;
        }
        if (t_person_count_by_type[id]){
          count = t_person_count_by_type[id];
        }
        if (count < max){
          add_type_ids = [...add_type_ids, id];
        }
      });

      console.log('add_type_ids');
      console.log(add_type_ids);

      add_type_ids.forEach((type_id) => {
        console.log('-> tag_add');
        tag_add(type_id, person_id);
      });
    }, 50);
  };

  $: if (!$person_nfc_auto_enabled){
    $tag_nfc_auto_enabled = false;
  }

  /**
  $: if ($selected_person_id){
    tags_add();
  }
  */
</script>

{#if $person_nfc_auto_enabled}
  <CardFooter>
    <Checkbox
      name=tag_nfc_auto_enabled
      bind:checked={$tag_nfc_auto_enabled}
    >
      Auto creatie
      <Badge color=success title="lid in {$focus_year.toString()}">
        {$focus_year.toString()}
      </Badge>
    </Checkbox>
  </CardFooter>
{/if}
