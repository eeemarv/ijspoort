<script>
    import Reg from './Reg.svelte';

    let registrations = [];

    async function updateReg(event) {
        const { reg } = event.detail;
        const update = await db.put(reg)
        if (update.ok) {
            await updateRegList()
        }
    }

    async function removeReg(event) {
        const { reg: regToRemove } = event.detail;
        const removal = await db.remove(regToRemove)
        if (removal.ok) {
            registrations = registrations.filter((reg) => {
                return reg._id !== regToRemove._id
            })
        }
    }
</script>

<div class="row">
    <div class="col h-100">
    <ul class="list-group list-group-scroll list-group-striped list-group-border-bottom" id="reg_list">
    </ul>
    {#each registrations as reg, index}
        <Reg
        localCount={registrations.length - index}
        reg={reg}
        on:remove={removeReg}
        on:update={updateReg} />
    {/each}
    </div>
</div>
