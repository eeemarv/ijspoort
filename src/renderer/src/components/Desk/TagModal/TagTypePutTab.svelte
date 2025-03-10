<script>
  import { getContext } from 'svelte';
  import Icon from '@iconify/svelte';
  import plusIcon from '@iconify/icons-fa/plus';
  import pencilIcon from '@iconify/icons-fa/pencil';
  import { createEventDispatcher } from 'svelte';
  import { Row, Col } from 'sveltestrap';
  import { Button } from 'sveltestrap';
  import { TabPane } from 'sveltestrap';
  import { FormGroup } from 'sveltestrap';
  import Radio from '../../Common/Radio.svelte';
  import { tag_type_map } from '../../../services/store';
  import TagSpan from '../../Tag/TagSpan.svelte';
  import { tag_type_put } from '../../../db_put/tag_put';

  const { setActiveTab } = getContext('tabContent');
  const dispatch = createEventDispatcher();

  export let tab;
  export let edit_type_id = undefined;

  let text = 'nieuw';
  let description = '';
  let color = 'orange';
  let max_per_person = 1;

  const init_values = () => {
    if (typeof edit_type_id === 'string'){
      const tag_type = $tag_type_map.get(edit_type_id);
      ({text, description, color, max_per_person} = tag_type);
    } else {
      text = 'nieuw';
      description = '';
      color = 'orange';
      max_per_person = 1;
    }
  };

  $: if (tab === 'type_put'){
    init_values();
  }

  const tag_colors = [
    {value: 'blue', label: 'B', title: 'Blauw'},
    {value: 'indigo', label: 'I', title: 'Indigo'},
    {value: 'purple', label: 'P', title: 'Purper'},
    {value: 'pink', label: 'R', title: 'Roos'},
    {value: 'red', label: 'R', title: 'Rood'},
    {value: 'orange', label: 'O', title: 'Oranje'},
    {value: 'yellow', label: 'G', title: 'Geel'},
    {value: 'green', label: 'G', title: 'Groen'},
    {value: 'cyan', label: 'C', title: 'Cyaan'},
    {value: 'grey', label: 'G', title: 'Grijs'},
    {value: 'maroon', label: 'B', title: 'Kastanjebruin'}
  ];

  const handle_click = () => {

    tag_type_put({text, description, color, max_per_person, _id: edit_type_id});
    if (typeof edit_type_id === 'string'){
      dispatch('updated', edit_type_id);
    }
    edit_type_id = undefined;
    setActiveTab('type_list');
  };
</script>

<TabPane tabId=type_put active={tab === 'type_put'}>
  <span slot=tab title="Tag type {typeof edit_type_id === 'string' ? 'aanpassen' : 'aanmaken'}">
    <Icon icon={typeof edit_type_id === 'string' ? pencilIcon : plusIcon} />
  </span>
  <h3 class=mt-2>
    {#if typeof edit_type_id === 'string'}
      Tag type aanpassen
    {:else}
      Nieuw tag type aanmaken
    {/if}
  </h3>

  <p>
    Voorbeeld: <TagSpan tag={{text: text, description: description, color: color, max_per_person: max_per_person}} />
  </p>
  <Row>
    <Col xs=2>
      <FormGroup>
        <label for=text>
          Tekst
        </label>
        <input
          type=text
          id=text
          class="form-control"
          bind:value={text}
        />
      </FormGroup>
    </Col>
    <Col xs=7>
      <FormGroup>
        <label for=description>
          Omschrijving
        </label>
        <input
          type=text
          id=description
          class=form-control
          bind:value={description}
        />
      </FormGroup>
    </Col>
    <Col>
      <FormGroup>
        <label for=max_per_person>
          Max aantal per lid
        </label>
        <input
          type=number
          id=max_per_person
          class=form-control
          bind:value={max_per_person}
        />
      </FormGroup>
    </Col>
  </Row>
  <Row>
    <Col>
      {#each tag_colors as tc}
        <Radio
          inline
          bind:group={color}
          name=color
          value={tc.value}
        >
          <TagSpan tag={{text: tc.label, description: tc.title, color: tc.value}} />
        </Radio>
      {/each}
    </Col>
  </Row>
  <Row>
    <Col>
      <div class="d-flex w-100 mt-3 justify-content-end">
        <div>
          <Button
            on:click={handle_click}
            color={typeof edit_type_id === 'string' ? 'primary' : 'success'}
            disabled={!text.length || !(max_per_person > 0) || !color}
          >
            {#if typeof edit_type_id === 'string'}
              <Icon icon={pencilIcon} /> Aanpassen
            {:else}
              <Icon icon={plusIcon} /> Toevoegen
            {/if}
          </Button>
        </div>
      </div>
    </Col>
  </Row>
</TabPane>
