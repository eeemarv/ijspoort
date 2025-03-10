<script>
  import Icon from '@iconify/svelte';
  import plusIcon from '@iconify/icons-fa/plus';
  import minusIcon from '@iconify/icons-fa/minus';
  import { TabPane, Card } from 'sveltestrap';
  import { members_only_enabled } from '../../../services/store';
  import { gate_member_open_time } from '../../../services/store';
  import { member_period_select } from '../../../services/store';
  import MemberPeriodDropdown from '../../Common/MemberPeriodDropdown.svelte';

  export let tab;
  let dropdown_open = false;
</script>

<TabPane tabId=members active={tab === 'members'}>
  <span slot=tab>
    Leden
  </span>
  <Card body>
    <div class=form-group>
      <label class=form-check-label for=members_only_enabled>
        Toegang enkel voor leden / periode
      </label>

      <div class="input-group-text input-form-group-lg">
        <div class=form-check>
          <input class="form-check-input ms-0 me-3"
            type=checkbox
            id=members_only_enabled
            bind:checked={$members_only_enabled}
            title="Enkel leden in {$member_period_select}"
          />
          <label class=form-check-label for=member_period_select>
            <MemberPeriodDropdown {dropdown_open}
              bind:member_period={$member_period_select}
              id=member_period_select
            />
          </label>
        </div>
    </div>

    <div class=form-group>
      <label for=gate_member_open_time>
        Tijd waarna poort automatisch dichtvalt (sec)
      </label>

      <div class="input-group input-group-lg">
        <input
          type=number
          id=gate_member_open_time
          tabindex=0
          class="form-control input-lg"
          bind:value={$gate_member_open_time}
          min=0
          max=999
          disabled={!$members_only_enabled}
          on:keypress
        />

        <div class="input-group-append">
          <button
            class="btn btn-info btn-lg"
            type="button"
            on:click={gate_member_open_time.dec}
            disabled={!$members_only_enabled}
          >
            <Icon icon={minusIcon} />
          </button>
        </div>

        <div class="input-group-append">
          <button
            class="btn btn-info btn-lg"
            type="button"
            on:click={gate_member_open_time.inc}
            disabled={!$members_only_enabled}
          >
            <Icon icon={plusIcon} />
          </button>
        </div>

        <div class="input-group-append">
          <button
            class="btn btn-info btn-lg"
            type="button"
            on:click={() => $gate_member_open_time = 8}
            disabled={!$members_only_enabled}
          >
            8
          </button>
        </div>

        <div class="input-group-append">
          <button
            class="btn btn-info btn-lg"
            type="button"
            on:click={() => $gate_member_open_time = 10}
            disabled={!$members_only_enabled}
          >
            10
          </button>
        </div>

        <div class="input-group-append">
          <button
            class="btn btn-info btn-lg"
            type="button"
            on:click={() => $gate_member_open_time = 12}
            disabled={!$members_only_enabled}
          >
            12
          </button>
        </div>

        <div class="input-group-append">
          <button
              class="btn btn-info btn-lg"
              type="button"
              on:click={() => $gate_member_open_time = 14}
              disabled={!$members_only_enabled}
            >
              14
            </button>
          </div>
      </div>
    </div>
  </Card>
</TabPane>

<style>
button {
  font-weight: bold;
  font-size: 1.4em;
  min-width: 3em;
}
input {
  font-weight: bold;
  font-size: 1.4em;
}
label {
  font-size: 1.4em;
}
</style>
