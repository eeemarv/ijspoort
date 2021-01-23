<script>
  import { db_member } from '../services/db';
  import { person } from '../services/store';
  import { Button } from 'sveltestrap';
  import { Modal, ModalHeader, ModalBody, ModalFooter } from 'sveltestrap';
  import { Row, Col } from 'sveltestrap';
  import { ListGroup, ListGroupItem } from 'sveltestrap';
  import PersonMemberId from './PersonMemberId.svelte';
  import PersonName from './PersonName.svelte';

  let open = false;
  const toggle = () => {
    open = !open;
  };

  let member_year_list = [];
  let year = new Date().getFullYear();
  let member_short_list = [];
  let member_long_list = [];
  let long_list_cols = [];
  let years_short_list = 6;
  let years_long_list = 9;

  const update_member_year_list = (person_id) => {
    year = new Date().getFullYear();
    member_year_list = [];
    member_short_list = [];
    member_long_list = [];
    long_list_cols = [];
    if (person_id === undefined){
      return;
    }
    db_member.query('search/count_by_person_id', {
        key: person_id,
        include_docs: true,
        reduce: false
    }).then((res) => {
        console.log('MEMBERS ---');
        console.log(res);
        res.rows.forEach((v) => {
          member_year_list.push(v.doc.year);
        });
        member_year_list.sort((a, b) => {
          return a < b ? -1 : 1;
        });
        for (let y = year - years_short_list + 1; y <= year; y++){
            member_short_list = [...member_short_list, {
              year: y,
              is_member: member_year_list.includes(y.toString())
            }];
        }
        for (y = year - years_long_list + 1; y <= year; y++){
            member_long_list = [...member_long_list, {
              year: y,
              is_member: member_year_list.includes(y.toString())
            }];
        }
        let col_size = Math.ceil(member_long_list.length / 4);
        while (member_long_list.length){
            long_list_cols = [...long_list_cols, member_long_list.splice(0, col_size)];
        }
    }).catch((err) => {
        console.log(err);
    });
  };

  $: update_member_year_list($person?._id);

  db_member.changes({
      since: 'now',
      live: true
  }).on('change', (change) => {
      console.log('member year changes (PersonMemberYear component)');
      console.log(change);
      update_member_year_list($person?._id);
  }).on('error', (err) => {
      console.log(err);
  });

</script>

<Modal isOpen={open} {toggle} size=lg>
  <ModalHeader {toggle}>
    Lidjaren
    <PersonMemberId member_id={$person.member_id} />
    <PersonName person={$person} />,
  </ModalHeader>
  <ModalBody>
    <Row>
      {#each long_list_cols as col}
      <Col>
          <ListGroup>
              {#each col as myc}
                  <ListGroupItem>
                  <Button
                    color={myc.is_member ? 'success' : 'dark'}
                    title="{myc.is_member ? 'Lid in' : 'Geen lid in'} {myc.year}"
                  >
                    {myc.year}
                  </Button>
                  </ListGroupItem>
              {/each}
          </ListGroup>
      </Col>
      {/each}
  </Row>
  </ModalBody>
  <ModalFooter>
      <Button color=primary on:click={toggle}>
          Sluiten
      </Button>
  </ModalFooter>
</Modal>

{#each member_short_list as item(item.year)}
  <Button
    color={item.is_member ? 'success' : 'dark'}
    title="{item.is_member ? 'Lid in' : 'Geen lid in'} {item.year}"
    class=mr-2
    on:click={toggle}
  >
    {item.year}
  </Button>
{/each}