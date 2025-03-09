<script>
  import Icon from '@iconify/svelte';
  import githubIcon from '@iconify/icons-fa/github';
  import { Card } from 'sveltestrap';

</script>

<Card body>
    <div class="gap-1 p-0 d-flex w-100 justify-content-between">
      <button
        type=button
        class="btn btn-primary w-100"
        on:click={window.bridge.openAssist}
        title="link naar Assist online"
      >
        Assist
      </button>
      <button
        type=button
        class="btn btn-primary w-100"
        on:click={window.bridge.openGithubRepo}
        color=primary
        title="link naar de open source code van ijspoort op github.com"
      >
        <Icon icon={githubIcon} />
        IJspoort
      </button>
    </div>
</Card>
