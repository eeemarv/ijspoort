<script>
  import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col } from 'sveltestrap';
  import LocaleDateString from '../Common/LocaleDateString.svelte';
  import TimeTag from '../Common/TimeTag.svelte';
  import * as Pancake from '@sveltejs/pancake';
  import { db_gate } from '../services/db';

  export let open = false;
  export let toggle = () => (open = !open);

  const days = 14;
  let d_graphs = [];
  let ready = false;

  const update_data = () => {
    ready = false;
    d_graphs = [];

    let now = new Date();
    let ts_epoch = now.getTime();
    let d_count = {};
    let add_graph;
    let dt_in;
    let dt_out;
    let current_count;
    let dt_x;
    let ts_date;

    let current_ts = undefined;

    (async () => {
      await db_gate.query('search/count_in_by_ts_epoch_per_5_min', {
        startkey: ts_epoch - (days * 86400000),
        endkey: ts_epoch,
        reduce: true,
        group: true
      }).then((res) => {
        console.log('res --- count_in_by_ts_epoch_per_5_min ---');
        console.log(res);
        res.rows.forEach((v) => {
          d_count[v.key] = {in: v.value};
        });
      }).catch((err) => {
        console.log(err);
      });

      await db_gate.query('search/count_out_by_ts_epoch_per_5_min', {
        startkey: ts_epoch - (days * 86400000),
        endkey: ts_epoch,
        reduce: true,
        group: true
      }).then((res) => {
        console.log('res --- count_out_by_ts_epoch_per_5_min ---');
        console.log(res);
        res.rows.forEach((v) => {
          if (d_count[v.key]){
            d_count[v.key].out = v.value;
          } else {
            d_count[v.key] = {out: v.value};
          }
        });
      }).catch((err) => {
        console.log(err);
      });

      console.log('--- D_COUNT ---');
      console.log(d_count);

      Object.keys(d_count).sort().forEach((ts) => {
        let d = d_count[ts];

        if (current_ts && ts <= current_ts){
          throw 'Error order ts ' + ts + ' and previous ts ' + current_ts;
        };
        // same graph
        if (current_ts && current_ts > (ts - 2000000)){

          while (current_ts < (ts - 400000)) {
            current_ts += 300000;
            ts_date = new Date(current_ts);
            dt_x = (current_ts - add_graph.ts) / 60000;
            add_graph.max_x = dt_x;
            add_graph.count_data.push({x: dt_x, y: current_count});
            add_graph.in_data.push({x: dt_x, y: 0});
            add_graph.out_data.push({x: dt_x, y: 0});

            add_graph.p_data.push({x: dt_x, y: current_count, hour: ts_date.getHours(), min: ts_date.getMinutes(), type: 'count'});

            if (current_count !== 0){
              add_graph.p_data.push({x: dt_x, y: 0, hour: ts_date.getHours(), min: ts_date.getMinutes(), type: 'in'});
            }

            if (ts_date.getMinutes() === 0){
              add_graph.x_grid.push(dt_x);
            }
          }

          current_ts = ts * 1;
          ts_date = new Date(current_ts);
          dt_in = d.in ? d.in : 0;
          add_graph.total_count += dt_in;
          dt_out = d.out ? d.out : 0;
          current_count += dt_in;
          current_count -= dt_out;
          current_count = current_count < 0 ? 0 : current_count;
          dt_x = (ts - add_graph.ts) / 60000;
          add_graph.max_x = dt_x;
          add_graph.count_data.push({x: dt_x, y: current_count});
          add_graph.in_data.push({x: dt_x, y: dt_in});
          add_graph.out_data.push({x: dt_x, y: -dt_out});
          add_graph.min_y = Math.min(add_graph.min_y, -dt_out);
          add_graph.max_y = Math.max(add_graph.max_y, dt_in, current_count);
          add_graph.max_x = dt_x;

          add_graph.p_data.push({x: dt_x, y: current_count, hour: ts_date.getHours(), min: ts_date.getMinutes(), type: 'count'});

          if (current_count !== dt_in){
            add_graph.p_data.push({x: dt_x, y: dt_in, hour: ts_date.getHours(), min: ts_date.getMinutes(), type: 'in'});
          }

          if (current_count !== -dt_out && dt_in !== -dt_out){
            add_graph.p_data.push({x: dt_x, y: -dt_out, hour: ts_date.getHours(), min: ts_date.getMinutes(), type: 'out'});
          }

          if (ts_date.getMinutes() === 0){
            add_graph.x_grid.push(dt_x);
          }
        } else {

          // store previous

          if (add_graph && add_graph.count_data.length > 5){
            d_graphs.push(add_graph);
          }

          // new graph

          add_graph = {};
          add_graph.ts = ts * 1;
          current_ts = ts * 1;
          add_graph.count_data = [];
          add_graph.in_data = [];
          add_graph.out_data = [];
          add_graph.x_grid = [];
          add_graph.closest = [];
          add_graph.p_data = [];
          ts_date = new Date(current_ts);

          dt_in = d.in ? d.in : 0;
          add_graph.total_count = dt_in;
          dt_out = d.out ? d.out : 0;
          current_count = dt_in - dt_out;
          current_count = current_count < 0 ? 0 : current_count;
          add_graph.count_data.push({x: 0, y: current_count});
          add_graph.in_data.push({x: 0, y: dt_in});
          add_graph.out_data.push({x: 0, y: -dt_out});
          add_graph.min_y = -dt_out
          add_graph.max_y = current_count;
          add_graph.max_x = 0;

          add_graph.p_data.push({x: 0, y: current_count, hour: ts_date.getHours(), min: ts_date.getMinutes(), type: 'count'});

          if (current_count !== dt_in){
            add_graph.p_data.push({x: dt_x, y: dt_in, hour: ts_date.getHours(), min: ts_date.getMinutes(), type: 'in'});
          }

          if (current_count !== -dt_out && dt_in !== -dt_out){
            add_graph.p_data.push({x: dt_x, y: -dt_out, hour: ts_date.getHours(), min: ts_date.getMinutes(), type: 'out'});
          }

          if (ts_date.getMinutes() === 0){
            add_graph.x_grid.push(0);
          }
        }
      });

      if (add_graph && add_graph.count_data.length > 5){
        d_graphs.push(add_graph);
      }

      ready = true;

      console.log('-- d_graphs ---');
      console.log(d_graphs);
    })();
  };

  $: if (open){
    update_data();
  }
</script>

<Modal isOpen={open} {toggle} size=xl>
  <ModalHeader {toggle}>
    In/uit historiek
  </ModalHeader>
  <ModalBody>
    {#if ready}
      {#each d_graphs as gr}
        <Row>
          <Col class=bg-blue>
            <LocaleDateString ts={gr.ts * 1} />,
            <TimeTag ts={gr.ts * 1} color=nn />
            Totaal aantal: {gr.total_count},
            Maximum binnen: {gr.max_y}
            <div class="chart">
              <Pancake.Chart x1=0 x2={gr.max_x} y1={gr.min_y} y2={gr.max_y}>
                <Pancake.Grid horizontal count={5} let:value>
                  <div class="grid-line horizontal">
                    <span>{value}</span>
                  </div>
                </Pancake.Grid>
                <Pancake.Grid vertical count={gr.max_x > 100 ? gr.max_x / 10 : gr.max_x / 5} let:value>
                  <span class="x-label">
                    {value}
                  </span>
                </Pancake.Grid>
                <Pancake.Svg>
                  {#each gr.x_grid as gx}
                    <Pancake.SvgLine data={[{x:gx, y: gr.min_y}, {x: gx, y:gr.max_y}]} let:d>
                      <path class="x-hour" {d} />
                    </Pancake.SvgLine>
                  {/each}
                  <Pancake.SvgLine data={[{x:0, y:0}, {x: gr.max_x, y:0}]} let:d>
                    <path class="zero" {d} />
                  </Pancake.SvgLine>
                  <Pancake.SvgLine data={gr.in_data} let:d>
                    <path class="in-data" {d} />
                  </Pancake.SvgLine>
                  <Pancake.SvgLine data={gr.out_data} let:d>
                    <path class="out-data" {d} />
                  </Pancake.SvgLine>
                  <Pancake.SvgLine data={gr.count_data} let:d>
                    <path class="data" {d} />
                  </Pancake.SvgLine>
                </Pancake.Svg>

                {#if gr.closest}
                  <Pancake.Point x={gr.closest.x} y={gr.closest.y}>
                    <span class="annotation-point {gr.closest.type}-point"></span>
                    <div class="annotation {gr.closest.type}-ann" style="transform: translate(-{100 * ((gr.closest.x - 0) / (gr.max_x))}%,0)">
                      <strong title="aantal">{gr.closest.type === 'in' ? '+' : ''}{gr.closest.y}</strong>
                      {#if gr.closest.hour !== undefined && gr.closest.min !== undefined}
                        <span title="tijdstip">
                          {gr.closest.hour.toString().padStart(2, '0')}:
                          {gr.closest.min.toString().padStart(2, '0')}
                        </span>
                      {/if}
                    </div>
                  </Pancake.Point>
                {/if}

                <Pancake.Quadtree data={gr.p_data} bind:closest={gr.closest} />
              </Pancake.Chart>
            </div>
          </Col>
        </Row>
      {/each}
    {/if}
  </ModalBody>
  <ModalFooter>
    <div class="d-flex w-100 justify-content-end">
      <Button
        color=primary on:click={toggle}
      >
        Sluiten
      </Button>
    </div>
  </ModalFooter>
</Modal>

<style>
	.chart {
		height: 400px;
		padding: 3em 0 2em 2em;
		margin: 0 0 36px 0;
	}

	.grid-line {
		position: relative;
		display: block;
	}

	.grid-line.horizontal {
		width: calc(100% + 2em);
		left: -2em;
		border-bottom: 1px dashed #ccc;
	}

	.grid-line span {
		position: absolute;
		left: 0;
		bottom: 2px;
		font-family: sans-serif;
		font-size: 16px;
		color: white;
	}

	.x-label {
		position: absolute;
		width: 4em;
		left: -2em;
		bottom: -22px;
		font-family: sans-serif;
		font-size: 16px;
		color: white;
		text-align: center;
	}

  path {
		stroke-linejoin: round;
		stroke-linecap: round;
		fill: none;
  }

	path.data {
		stroke: white;
		stroke-width: 2px;
	}

	path.zero {
		stroke: white;
    stroke-dasharray: 15, 5, 5, 5;
		stroke-width: 1px;
	}

	path.x-hour {
		stroke: white;
    stroke-dasharray: 10, 5, 3, 5;
		stroke-width: 1px;
	}

	path.in-data, path.out-data {
    stroke-dasharray: 10, 10;
		stroke-width: 2px;
	}

  path.in-data {
    stroke: lightgreen;
  }
  path.out-data {
    stroke: lightseagreen;
  }

	.annotation {
		position: absolute;
		white-space: nowrap;
		bottom: 1em;
		line-height: 1.2;
		background-color: rgba(0, 0, 0, 0.3);
		padding: 0.2em 0.4em;
		border-radius: 4px;
	}

	.annotation-point {
		position: absolute;
		width: 12px;
		height: 12px;
		background-color: white;
		border-radius: 50%;
		transform: translate(-50%,-50%);
	}

	.annotation strong {
		display: block;
		font-size: 30px;
	}

	.annotation span {
		display: block;
		font-size: 20px;
	}

  .in-point {
    background-color: lightgreen;
  }
  .out-point {
    background-color: lightseagreen;
  }
  .in-ann {
    color: lightgreen;
  }
  .out-ann {
    color: lightseagreen;
  }
</style>
