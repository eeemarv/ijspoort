<script>
  import { db_tag } from '../services/db';
  import { tag_type_table } from '../services/store';
  import { person_tag_table } from '../services/store';
  import { tag_count_table } from '../services/store';

  const listen_changes = () => {

    console.log('-------- LISTEN CHANGES TAGS ----');

    db_tag.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', (change) => {

      if (change.deleted){

        if (change.id.startsWith('0_')){

          delete $tag_type_table[change.id];
          $tag_type_table = $tag_type_table;
          delete $tag_count_table[change.id];
          $tag_count_table = $tag_count_table;
          console.log('== change delete $tag_type_table ', change);
          return;
        }

        if (change.id.startsWith('t0_')){

          console.log('== change delete $person_tag_table ', change);

          let ts_ary = [];
          let person_id = change.doc.person_id;
          let type_id = change.doc.type_id;
          let ts_epoch = change.doc.ts_epoch;

          if ($tag_count_table[type_id] !== undefined){
            let count = $tag_count_table[type_id];
            count--;
            count = count < 0 ? 0 : count;
            $tag_count_table[type_id] = count;
          }

          if ($person_tag_table[person_id] === undefined){
            return;
          }

          if ($person_tag_table[person_id][type_id] === undefined){
            return;
          }

          $person_tag_table[person_id][type_id].forEach((ts) => {
            if (ts === ts_epoch){
              return;
            }
            ts_ary.push(ts);
          });

          $person_tag_table[person_id][type_id] = [...ts_ary];

          return;
        }

        console.log('== tag change delete > not stored in table', change);

        return;
      }

      if (change.id.startsWith('0_')){

        console.log('== change $tag_type_table ', change);
        $tag_type_table[change.id] = {...change.doc};

        return;
      }

      if (change.id.startsWith('t0_')){

        console.log('== change $person_tag_table', change);

        let person_id = change.doc.person_id;
        let type_id = change.doc.type_id;
        let ts_epoch = change.doc.ts_epoch;

        if ($person_tag_table[person_id] === undefined){
          $person_tag_table[person_id] = {};
        }

        if ($person_tag_table[person_id][type_id] === undefined){
          $person_tag_table[person_id][type_id] = [];
        }

        $person_tag_table = [...$person_tag_table[person_id][type_id], ts_epoch];

        if ($tag_count_table[type_id] === undefined){
          $tag_count_table[type_id] = 0;
        }

        $tag_count_table[type_id] = $tag_count_table[type_id] + 1;

        return;
      }

      console.log('== tag change > not stored in table', change);

    }).on('error', (err) => {
      console.log(err);
    });
  };

  db_tag.allDocs({
    include_docs: true,
    startkey: '0_',
    endkey: '0_\uffff',
  }).then((res) => {

    console.log('load $tag_type_table TAG 0_ RES');
    console.log(res);

    let tt_table = {};

    res.rows.forEach((v) => {
      tt_table[v.id] = {...v.doc};
    });

    $tag_type_table = {...tt_table};

    console.log('=====$tag_type_table====');
    console.log($tag_type_table);

    return db_tag.allDocs({
      startkey: 't0_',
      endkey: 't0_\uffff',
      include_docs: true
    });

  }).then((res) => {

    console.log('load $person_tag_table TAG t0_ RES');
    console.log(res);

    let pt_table = {};
    let c_table = {};

    res.rows.forEach((v) => {
      let a = v.id.substring(3);
      let b = a.split('_');
      let type_id = '0_' + b[0];
      let person_id = b[1];
      let ts_epoch = parseInt(b[2]);

      if (pt_table[person_id] === undefined){
        pt_table[person_id] = {};
      }

      if (pt_table[person_id][type_id] === undefined){
        pt_table[person_id][type_id] = [];
      }

      pt_table[person_id][type_id].push(ts_epoch);

      if (c_table[type_id] === undefined){
        c_table[type_id] = 0;
      }

      c_table[type_id]++;
    });

    $person_tag_table = {...pt_table};
    $tag_count_table = {...c_table};

    console.log('=====$person_tag_table====');
    console.log($person_tag_table);
    console.log('=====$tag_count_table====');
    console.log($tag_count_table);

    listen_changes();

  }).catch((err) => {
    console.log(err);
  });
</script>
