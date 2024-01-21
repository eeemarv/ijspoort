<script>
  let ts_date = new Date();

  setInterval(() => {
    ts_date = new Date();
  }, 1000);
</script>

<span>
<span>
  {ts_date.toLocaleDateString('nl-BE', {weekday: 'short'})}
</span>
<br />
<span>
  {ts_date.toLocaleDateString('nl-BE', {day: 'numeric', month: 'short', })}
</span>
</span>

<style>
span {
 font-size: 1em;
 line-height: 1;
}
</style>