<script>
  import PersonMemberYear from '../../render/Person/PersonMemberYear.svelte';

  export let person_id = undefined;
  let year_ary = [];

  $: if (person_id){
    const this_year = (new Date()).getFullYear();
    year_ary = [
      this_year - 1, this_year, this_year + 1
    ];
  }
</script>

<div class="bg-dark p-2">
  {#each year_ary as year(year)}
    <PersonMemberYear {year} {person_id} font_size=1.3em />
  {/each}
</div>

