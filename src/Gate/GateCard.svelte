<script>
  import { Card, CardHeader } from 'sveltestrap';
  import GateSens from './GateSens.svelte';
</script>

<Card class=my-2>
  <CardHeader>
    <div class="d-flex w-100 justify-content-between">
      <div>
        Poort
      </div>
      <div>
        <GateSens />
      </div>
    </div>
  </CardHeader>
</Card>