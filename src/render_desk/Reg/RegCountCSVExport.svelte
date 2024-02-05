<script>
  const { ipcRenderer } = window.require('electron');
  import { Button, Modal, ModalBody, ModalHeader, ListGroup, ListGroupItem } from 'sveltestrap';
  import { db_reg } from '../../db/db';
  import { download } from '../../services/download';
  import Papa from 'papaparse';
  import ModalFooterClose from '../../render/Common/ModalFooterClose.svelte';

  let open = false;
  const toggle = () => {
    open = !open;
  };

  ipcRenderer.on('reg.count.csv.export', () => {
    open = true;
  });

  const get_id_str = () => {
    let id_str = (new Date()).toLocaleDateString('nl-BE', {weekday: 'short', month: 'short', year: 'numeric', day:'numeric'}).replace(' ', '_');
    return id_str + '_' + Math.random().toString(36).substring(2, 6);
  };

  const get_day_str = (ts) => {
    return ts.toLocaleDateString('nl-BE', {weekday: 'short', month: 'short', year: 'numeric', day:'numeric'});
  };

  const get_iso_week = (ts) => {
    var ts_dt = new Date(ts.valueOf());
    var day_n = (ts.getDay() + 6) % 7;
    ts_dt.setDate(ts_dt.getDate() - day_n + 3);
    var first_thursday = ts_dt.valueOf();
    ts_dt.setMonth(0, 1);
    if (ts_dt.getDay() !== 4) {
    ts_dt.setMonth(0, 1 + ((4 - ts_dt.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((first_thursday - ts_dt) / 604800000);
  };

  const handle_export_every = () => {
    let exp = {
      fields:['dag', 'aanvang', 'aantal uren', 'registraties', 'max aantal reg./uur'],
      data:[]
    };

    console.log('CLICKED (tot)');

    db_reg.query('search/count_per_hour', {
      reduce: true,
      group: true
    }).then((res) => {
      console.log('RES');
      console.log(res);
      let reg_max = 0;
      let reg_count = 0;
      let prev_day_str = '';
      let prev_hour = -10;
      let first_hour;
      let hour_count = 0;
      let next = false;

      const push_rec = () => {
        let d = [];
        d.push(prev_day_str);
        d.push(first_hour.toString() + 'u');
        d.push(hour_count.toString());
        d.push(reg_count.toString());
        d.push(reg_max.toString());
        exp.data.push(d);
      };

      res.rows.forEach((v) => {
        let ts = new Date(v.key);
        let day_str = get_day_str(ts);
        let hour = ts.getHours();

        if (day_str != prev_day_str){
          next = true;
        }
        if (hour - 1 != prev_hour){
          next = true;
        }
        if (next === true && hour_count > 0 && reg_count > 10){
          push_rec();
        }
        if (next === true){
          reg_max = 0;
          reg_count = 0;
          first_hour = hour;
          hour_count = 0;
          next = false;
        }

        hour_count++;
        reg_count += v.value;
        if (v.value > reg_max){
          reg_max = v.value;
        }
        prev_hour = hour;
        prev_day_str = day_str;

      });
      if (hour_count > 0 && reg_count > 10){
        push_rec();
      }
      return Papa.unparse(exp);
    }).then((csv) => {
      download(csv,
        'reg_tot_' + get_id_str() + '.csv',
        'test/csv'
      );
      open = false;
    }).catch((err) => {
      console.log('ERR');
      console.log(err);
    });
  };

  const handle_export_week = () => {
    let exp = {
      fields:['week', 'eerste dag', 'registraties'],
      data:[]
    };

    console.log('CLICKED (week)');

    db_reg.query('search/count_per_hour', {
      reduce: true,
      group: true
    }).then((res) => {
      console.log('RES');
      console.log(res);
      let reg_count = 0;
      let first_day_str;
      let prev_week;
      let week;
      let next = false;

      const push_rec = () => {
        let d = [];
        d.push(prev_week.toString());
        d.push(first_day_str);
        d.push(reg_count.toString());
        exp.data.push(d);
      };

      res.rows.forEach((v) => {
        let ts = new Date(v.key);

        week = get_iso_week(ts);

        if (week !== prev_week){
          next = true;
        }
        if (next === true && typeof prev_week !== 'undefined'){
          push_rec();
        }
        if (next === true){
          reg_count = 0;
          first_day_str = get_day_str(ts);
          prev_week = week;
          next = false;
        }

        reg_count += v.value;
      });
      if (reg_count > 0 && typeof prev_week !== 'undefined'){
        push_rec();
      }
      return Papa.unparse(exp);
    }).then((csv) => {
      download(csv,
        'reg_week_' + get_id_str() + '.csv',
        'test/csv'
      );
      open = false;
    }).catch((err) => {
      console.log('ERR');
      console.log(err);
    });
  };

  const handle_export_month = () => {
    let exp = {
      fields:['jaar', 'maand', 'registraties'],
      data:[]
    };

    console.log('CLICKED (month)');

    db_reg.query('search/count_per_hour', {
      reduce: true,
      group: true
    }).then((res) => {
      console.log('RES');
      console.log(res);
      let reg_count = 0;
      let month_name;
      let year_str;
      let prev_month;
      let month;
      let next = false;

      const push_rec = () => {
        let d = [];
        d.push(year_str);
        d.push(month_name);
        d.push(reg_count.toString());
        exp.data.push(d);
      };

      res.rows.forEach((v) => {
        let ts = new Date(v.key);

        week = get_iso_week(ts);

        month = ts.getMonth();

        if (month !== prev_month){
          next = true;
        }
        if (next === true && typeof prev_month !== 'undefined'){
          push_rec();
        }
        if (next === true){
          reg_count = 0;
          prev_month = month;
          month_name = ts.toLocaleDateString('nl-BR', {month: 'short'});
          year_str = ts.getFullYear().toString();
          next = false;
        }

        reg_count += v.value;
      });
      if (reg_count > 0 && typeof prev_month !== 'undefined'){
        push_rec();
      }
      return Papa.unparse(exp);
    }).then((csv) => {
      download(csv,
        'reg_month_' + get_id_str() + '.csv',
        'test/csv'
      );
      open = false;
    }).catch((err) => {
      console.log('ERR');
      console.log(err);
    });
  };

</script>

<Modal isOpen={open} {toggle} size=xl>
  <ModalHeader {toggle}>
    Export registratie aantallen
  </ModalHeader>
  <ModalBody>
    <ListGroup>
      <ListGroupItem>
        <Button color=warning on:click={handle_export_every}>
          Export CSV aantal/zwemmoment
        </Button>
      </ListGroupItem>
      <ListGroupItem>
        <Button color=warning on:click={handle_export_week}>
          Export CSV aantal/week
        </Button>
      </ListGroupItem>
      <ListGroupItem>
        <Button color=warning on:click={handle_export_month}>
          Export CSV aantal/maand
        </Button>
      </ListGroupItem>
    </ListGroup>
  </ModalBody>
  <ModalFooterClose on:click={toggle} />
</Modal>