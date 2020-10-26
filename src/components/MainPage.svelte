<script>
    import Manual from './Manual.svelte';
    import RegList from './RegList.svelte';
    import EID from './EID.svelte';
    import NFC from './NFC.svelte';
</script>

<div class="container-fluid">
    <div class="row vh-100">
      <div class="col-md-9 vh-100">
          <Manual/>
          <RegList/>
      </div>

      <div class="col-md-3 bg-primary h-100">
        <div class="row h-25">
          <div class="col">
              <EID/>
              <NFC/>
          </div>
        </div>

        <div class="row h-25">
          <div class="col">
          </div>
        </div>
        <div class="row h-25">
          <div class="col">

          </div>
        </div>

        <div class="row h-25">
          <div class="col p-5">
              <h1>ijspoort</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
