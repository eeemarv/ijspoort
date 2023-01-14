<script>
  import { createEventDispatcher } from 'svelte';
  import { getContext } from 'svelte';
  import Icon from '@iconify/svelte';
  import plusIcon from '@iconify/icons-fa/plus';
  import pencilIcon from '@iconify/icons-fa/pencil';
  import lodash from 'lodash';
  import { onMount } from 'svelte';
  import { Row, Col } from 'sveltestrap';
  import { Button } from 'sveltestrap';
  import { TabPane } from 'sveltestrap';
  import { FormGroup } from 'sveltestrap';
  import Radio from '../Common/Radio.svelte';
  import { db_tag } from '../services/db';
  import Tag from './Tag.svelte';
  import { tag_types_enabled } from '../services/store';
  import { tag_types } from '../services/store';

  const { setActiveTab } = getContext('tabContent');

  export let tab;
  export let edit_tag_id = undefined;
  let handle_click;

  let text = 'nieuw';
  let description = '';
  let color = 'orange';
  let max_per_person = 1;

  const init_values = () => {
    if (typeof edit_tag_id === 'string'){
      text = $tag_types[edit_tag_id].text;
      description = $tag_types[edit_tag_id].description;
      color = $tag_types[edit_tag_id].color;
      max_per_person = $tag_types[edit_tag_id].max_per_person;
    } else {
      text = 'nieuw';
      description = '';
      color = 'orange';
      max_per_person = 1;
    }
  };

  $: {
    tab;
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
    {value: 'grey', label: 'G', title: 'Grijs'}
  ];

  const put_tag_type = (edit_tag_id) => {

    let tag = {
      text: text,
      description: description,
      color: color,
      max_per_person
    };

    if (typeof edit_tag_id === 'undefined'){
      let ts_epoch = (new Date()).getTime();
      tag.ts_epoch = ts_epoch;
      let id = '';
      while (id.length !== 8){
        id = Math.random().toString(36).substring(2,10);
      }

      tag._id = '0_' + id;

      db_tag.put(tag).then((res) => {
        console.log('-- db_tag.put --');
        console.log(res);
        $tag_types_enabled[tag._id] = true;
      }).catch((err) => {
        console.log('ERR db_tag.put');
        console.log(err);
      });

      return;
    }

    tag._id = edit_tag_id;

    db_tag.get(edit_tag_id).then((res) => {
      tag.ts_epoch = res.ts_epoch;
      let comp = {...res};
      delete comp._rev;
      if (lodash.isEqual(comp, tag)){
        throw 'no change for tag ' + tag._id;
      }
      tag._rev = res._rev;
      console.log('db_tag PUT');
      console.log(tag);
      return db_tag.put(tag);
    }).then((res) => {
      console.log('tag ' + res.id + ' updated');
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  };

  onMount(() => {
    handle_click = () => {
      put_tag_type(edit_tag_id);
      edit_tag_id = undefined;
      setActiveTab('types');
    };
  });
</script>

<TabPane tabId=type_put active={tab === 'type_put'}>
  <span slot=tab title="Tag type {typeof edit_tag_id === 'string' ? 'aanpassen' : 'aanmaken'}">
    <Icon icon={typeof edit_tag_id === 'string' ? pencilIcon : plusIcon} />
  </span>
  <h3 class=mt-2>
    {#if typeof edit_tag_id === 'string'}
      Tag type aanpassen
    {:else}
      Nieuw tag type aanmaken
    {/if}
  </h3>

  <p>
    Voorbeeld: <Tag tag={{text: text, description: description, color: color, max_per_person: max_per_person}} />
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
          <Tag tag={{text: tc.label, description: tc.title, color: tc.value}} />
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
            color={typeof edit_tag_id === 'string' ? 'primary' : 'success'}
            disabled={!text.length || !(max_per_person > 0) || !color}
          >
            {#if typeof edit_tag_id === 'string'}
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
