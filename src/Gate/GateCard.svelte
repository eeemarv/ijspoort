<script>
  import { Card, CardHeader, CardFooter } from 'sveltestrap';
  import GateSens from './GateSens.svelte';
</script>

<Card class=m-3>
  <CardHeader>
    Poort
  </CardHeader>
  <CardFooter>
    <GateSens />
  </CardFooter>
</Card>