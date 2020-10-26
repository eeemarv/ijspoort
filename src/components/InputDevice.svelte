<div class="card text-white border border-white m-3">
    <div class="card-body border-bottom border-white py-2" class:bg-on={dev_on}>NFC</div>
    <div class="card-body py-2"
        class:bg-on={uid_ok}
        class:bg-warning={uid_unknown}>
        <p class="card-text py-0 mb-0">
            {uid ? uid : '---'}
        </p>
    </div>
</div>