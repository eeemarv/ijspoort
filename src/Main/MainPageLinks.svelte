<script>
  const { shell } = require('electron');
  import { Card, CardBody, CardHeader } from 'sveltestrap';
  import { onMount } from 'svelte';

  let handle_open_assist;
  let handle_open_repo;

  onMount(() => {
    handle_open_assist = () => {
      shell.openExternal('https://assistonline.eu');
    };

    handle_open_repo = () => {
      shell.openExternal('https://github.com/eeemarv/ijspoort');
    };
  });
</script>

<Card>
  <CardHeader>
    Externe links
  </CardHeader>
  <CardBody>
    <div class="d-grid gap-2">
      <button
        type=button
        class="btn btn-primary"
        on:click={handle_open_assist}
      >
        Assist online
      </button>
      <button
        type=button
        class="btn btn-primary"
        on:click={handle_open_repo}
        color=primary
      >
        IJspoort code
      </button>
    </div>
  </CardBody>
</Card>
