<script>
  const env = window.require('electron').remote.process.env;
  const { ipcRenderer } = window.require('electron');
  import { createEventDispatcher, onMount } from 'svelte';
  import { gate_count, gate_count_enabled, gate_nfc_enabled } from '../services/store';
  import { db_gate } from '../services/db';
  import GateGraphModal from '../GateGraph/GateGraphModal.svelte';

  // hold person and nfc_uid data until gate closes
  export let gate_person = undefined;
  export let gate_nfc_uid = undefined;
  export let font_size = '1em';

  const debug_enabled = env.DEBUG === '1';
  const gate_enabled = env.GATE === '1';
  const emulate_sens_in_out = env.EMULATE_SENS_IN_OUT === '1';
  const dispatch = createEventDispatcher();

  const count_hours = 5;
  const refresh_gate_count_interval = 20000;
  let triggered_in = false;
  let trigger_in;
  let handle_click_in;
  let count_in = 0;
  let triggered_out = false;
  let trigger_out;
  let handle_click_out;
  let count_out = 0;
  let graph_open = false;

  const update_count_in = () => {
    let ts_date = new Date(Date.now() - (3600000 * count_hours));
    db_gate.query('search/count_in_by_ts_epoch', {
      startkey: ts_date.getTime(),
      reduce: true
    }).then((res) => {
      console.log('count_in');
      console.log(res);
      if (res.rows.length){
        count_in = res.rows[0].value;
      } else {
        count_in = 0;
      }
    }).catch((err) => {
      console.log(err);
    });
  };

  const update_count_out = () => {
    let ts_date = new Date(Date.now() - (3600000 * count_hours));
    db_gate.query('search/count_out_by_ts_epoch', {
      startkey: ts_date.getTime(),
      reduce: true
    }).then((res) => {
      console.log('count_out');
      console.log(res);
      if (res.rows.length){
        count_out = res.rows[0].value;
      } else {
        count_out = 0;
      }
    }).catch((err) => {
      console.log(err);
    });
  };

  const db_gate_put = (op) => {
    const now = new Date();
    let gt = {
        _id: 'g' + now.getTime().toString(),
        ts_epoch: now.getTime()
    };

    switch (op) {
      case 'out':
        gt.out = true;
        break;
      case 'in':
        gt.in = true;
        if (gate_person){
          gt.person_id = gate_person._id;
        }
        if (gate_nfc_uid){
          gt.nfc_uid = gate_nfc_uid;
        }
        gate_person = undefined;
        gate_nfc_uid = undefined;
        break;
      default:
        throw 'wrong operation';
        break;
    }

    if ($gate_count_enabled){
      gt.count = $gate_count;
    }

    db_gate.put(gt).then((res) => {
      console.log('put db_gate');
      console.log(res);
      console.log('-- GT --');
      console.log(gt);
    }).catch((err) => {
      console.log('ERR put db_gate');
      console.log(err);
    });
  };

  onMount(() => {
    trigger_in = () => {
      if ($gate_count_enabled){
        gate_count.dec();
      }
      db_gate_put('in');
      dispatch('triggered_in');
    }

    trigger_out = () => {
      if ($gate_count_enabled){
        gate_count.inc();
      }
      db_gate_put('out');
      dispatch('triggered_out');
    }

    handle_click_in = () => {
      if (debug_enabled && emulate_sens_in_out){
        trigger_in();
      } else if (!gate_enabled){
        graph_open = true;
      }
    };

    handle_click_out = () => {
      if (debug_enabled && emulate_sens_in_out){
        trigger_out();
      } else if (!gate_enabled){
        graph_open = true;
      }
    };

    ipcRenderer.on('sens.in', (ev) => {
      trigger_in();
    });

    ipcRenderer.on('sens.out', (ev) => {
      trigger_out();
    });

    update_count_in();
    update_count_out();

    setInterval(() => {
      update_count_in();
      update_count_out();
    }, refresh_gate_count_interval);

    db_gate.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {
      console.log('db_gate change');
      console.log(change);
      if (change.doc.in){
        triggered_in = true;
        setTimeout(() => {
            triggered_in = false;
        }, 1000);
        update_count_in();
      } else if (change.doc.out){
        update_count_out();
          triggered_out = true;
        setTimeout(() => {
            triggered_out = false;
        }, 1000);
      }
    }).on('error', (err) => {
      console.log(err);
    });
  });
</script>

<GateGraphModal bind:open={graph_open} />

<span class="badge me-1"
  style="--font-size: {font_size};"
  class:bg-success={triggered_in}
  class:bg-dark={!triggered_in}
  title="Ingangssensor"
  on:click={() => handle_click_in()}
  on:keyup={() => {}}
>
  In: {count_in}
</span>

<span class="badge me-1"
  style="--font-size: {font_size};"
  class:bg-success={triggered_out}
  class:bg-dark={!triggered_out}
  title="Uitgangssensor"
  on:click={() => handle_click_out()}
  on:keyup={() => {}}
>
  Uit: {count_out}
</span>

<style>
span {
  font-size: var(--font-size);
}
</style>