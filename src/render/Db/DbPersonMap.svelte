<script>
  import { db_person } from '../services/db';
  import { update_person_map } from '../services/map';

  db_person.allDocs({
    include_docs: true,
    startkey: 'n',
    endkey: 'n\uffff'
  }).then((res) => {

    console.log('load $person_map PERSON RES');
    console.log(res);

    const person_ary = res.rows ?? [];

    update_person_map(person_ary);

  }).catch((err) => {
    console.log(err);
  });

</script>
