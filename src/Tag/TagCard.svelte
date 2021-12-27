<script>
  import { Card, CardBody } from 'sveltestrap';
  import TagCardHeader from './TagCardHeader.svelte';
  import TagTypesFetch from './TagTypesFetch.svelte';
</script>

<TagTypesFetch />

<Card class=m-3>
  <TagCardHeader />
  <CardBody>
    ---
  </CardBody>
</Card>
