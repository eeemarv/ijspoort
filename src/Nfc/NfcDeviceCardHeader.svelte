<script>
  import NfcCountButton from './NfcCountButton.svelte';
  import NfcDevice from './NfcDevice.svelte';

  let on;
  let error;
</script>

<NfcDevice bind:on bind:error />

<div class="card-header py-2 d-flex w-100 justify-content-between"
  class:bg-success={on && !error}
  class:bg-danger={error}
>
  <div title="Nfc/RFiD tags">
    NFC
    {error ? ' fout apparaat' : ''}
  </div>
  <div>
    <NfcCountButton />
  </div>
</div>
