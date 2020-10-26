<script>
    import Reg from './Reg.svelte';

    let registrations = {};
</script>

<div class="row">
    <div class="col h-100">
    <ul class="list-group list-group-scroll list-group-striped list-group-border-bottom" id="reg_list">
    </ul>
    {#each registrations as reg}
        <Reg/>
    {/each}
    </div>
</div>
