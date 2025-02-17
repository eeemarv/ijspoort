<script>
  const { shell } = require('electron');
  import Icon from '@iconify/svelte';
  import githubIcon from '@iconify/icons-fa/github';
  import { Card } from 'sveltestrap';
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

<Card body>
    <div class="gap-1 p-0 d-flex w-100 justify-content-between">
      <button
        type=button
        class="btn btn-primary w-100"
        on:click={handle_open_assist}
        title="link naar Assist online"
      >
        Assist
      </button>
      <button
        type=button
        class="btn btn-primary w-100"
        on:click={handle_open_repo}
        color=primary
        title="link naar de open source code van ijspoort op github.com"
      >
        <Icon icon={githubIcon} />
        IJspoort
      </button>
    </div>
</Card>
