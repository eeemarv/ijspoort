<script>
  import { Col } from 'sveltestrap';
  import NFC from './NFC.svelte';
  import Clock from '../Common/Clock.svelte';
  import { person } from './../services/store';

  let reg_list;

  const handle_register_by_nfc = ((event) => {
    $person = undefined;
    reg_list.add_reg(event.detail.person, 'nfc');
  });

</script>

<Col md=9 class=vh-100>

</Col>

<Col class="bg-primary h-100">
  <NFC on:register_by_nfc={handle_register_by_nfc} />
  <div class=m-3>
    <Clock />
  </div>
</Col>
