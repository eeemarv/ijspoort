<script>
  import { Row, Col } from 'sveltestrap';
  import { TabPane } from 'sveltestrap';
  import LocaleDateString from '../../Common/LocaleDateString.svelte';
  import TimeTag from '../../Common/TimeTag.svelte';
  import * as Pancake from '@sveltejs/pancake';
  import DaysPeriodInput from './DaysPeriodInput.svelte';
  import DaysOffsetInput from './DaysOffsetInput.svelte';
  import AwaitNoResults from '../../Await/AwaitNoResults.svelte';
  import AwaitError from '../../Await/AwaitError.svelte';
  import Await from '../../Await/Await.svelte';
  import { gate_get_step_count } from '../../db_get/gate_get';
  import { reg_map } from '../../services/store';

  export let tab;

  const step_time = 300000; // 5 min
  const next_graph_time = 3600000; // 1 hour

  const graphs_map = new Map();

  let closest = undefined;

  let days = 14;
  let days_offset = 0;

  const calc_min_max_y = (g) => {
    g.min_y = Math.min(...g.out);
    g.max_y = Math.max(...g.acc, ...g.in);
  };

  const acc = (acc, add, sub) => {
    const res = acc + add + sub;
    if (res < 0){
      return 0;
    }
    return res;
  };

  const push_p = (g, ts, y_in, y_out) => {
    const x = g.in.length;
    const prev_acc = x ? g.acc[x - 1] : 0;
    const d_acc = acc(prev_acc, y_in, y_out);
    g.in.push(y_in);
    g.out.push(y_out);
    g.acc.push(d_acc);
    if (!(ts % 3600000)){
      g.h.push(x);
    }
    g.p.push({x: x, y: d_acc, type: 'acc', ts: ts});
    if (y_in !== d_acc){
      g.p.push({x: x, y: y_in, type: 'in', ts: ts});
    }
    if (y_out !== d_acc && y_out !== y_in){
      g.p.push({x: x, y: y_out, type: 'out', ts: ts});
    }
  }

  const update_view = async (days, days_offset) => {

    let graph_ts = undefined;
    let last_ts = undefined;

    graphs_map.clear();

    const now = new Date();
    const ts_epoch = now.getTime();
    const ts_end = ts_epoch - (days_offset * 86400000);
    const ts_start = ts_end - (days * 86400000);

    const g_map = await gate_get_step_count(ts_start, ts_end, step_time);

    console.log('=== G_MAP ===');
    console.log(g_map);

    for (const [ts, g5] of g_map){

      if (last_ts !== undefined && (last_ts + next_graph_time) < ts){

        const gg = graphs_map.get(graph_ts);
        calc_min_max_y(gg);

        graph_ts = undefined;
      }

      if (graph_ts === undefined){

        graph_ts = ts;

        graphs_map.set(graph_ts, {
          in: [],
          out: [],
          acc: [],
          p: [],
          h: [],
          max_y: 0,
          min_y: 0,
        });
      }

      const g = graphs_map.get(graph_ts);

      while (ts < graph_ts + (g.in.length * step_time)){
        const new_ts = graph_ts + (step * step_time);
        push_p(g, new_ts, 0, 0);
      }

      push_p(g, ts, g5.in, g5.out);

      last_ts = ts;
    }

    if (graph_ts !== undefined){
      const gg = graphs_map.get(graph_ts);
      calc_min_max_y(gg);
    }

    console.log('==== GRAPHS_MAP ===', graphs_map);

    return graphs_map;
  };
</script>

<TabPane tabId=graph active={tab === 'graph'}>
  <span slot=tab>
    In/uit historiek
  </span>
  <Row>
    <Col>
      <DaysPeriodInput bind:days />
    </Col>
    <Col>
      <DaysOffsetInput bind:days_offset />
    </Col>
  </Row>
  {#if tab === 'graph'}
  {#await update_view(days, days_offset, $reg_map)}
    <Await />
  {:then graphs_map}
    {#each [...graphs_map] as [graph_ts, graph](graph_ts)}
      <Row>
        <Col class=bg-black>
          <LocaleDateString ts_epoch={graph_ts} />,
          <TimeTag ts={graph_ts} color=nn />
          Totaal in: {graph.in.reduce(((acc, a) => acc + a), 0)},
          uit: {graph.out.reduce((acc, a) => acc - a, 0)},
          Maximum binnen: {Math.max(...graph.acc)}
          <div class="chart">
            <Pancake.Chart x1=0 x2={graph.acc.length - 1} y1={graph.min_y} y2={graph.max_y}>
              <Pancake.Grid horizontal count={5} let:value>
                <div class="grid-line horizontal">
                  <span>{value}</span>
                </div>
              </Pancake.Grid>
              <Pancake.Grid vertical count={graph.acc.length > 99 ? graph.acc.length / 10 : graph.acc.length / 5} let:value>
                <span class="x-label">
                  {value * (step_time / 60000) }
                </span>
              </Pancake.Grid>
              <Pancake.Svg>
                {#each graph.h as hx (hx)}
                  <Pancake.SvgLine data={[{x: hx, y: graph.min_y}, {x: hx, y: graph.max_y}]} let:d>
                    <path class="x-hour" {d} />
                  </Pancake.SvgLine>
                {/each}
                <Pancake.SvgLine data={[{x:0, y:0}, {x: graph.acc.length - 1, y:0}]} let:d>
                  <path class="zero" {d} />
                </Pancake.SvgLine>
                <Pancake.SvgLine data={graph.in.map((v, i) => {return {x: i, y: v};})} let:d>
                  <path class="in-data" {d} />
                </Pancake.SvgLine>
                <Pancake.SvgLine data={graph.out.map((v, i) => {return {x: i, y: v};})} let:d>
                  <path class="out-data" {d} />
                </Pancake.SvgLine>
                <Pancake.SvgLine data={graph.acc.map((v, i) => {return {x: i, y: v};})} let:d>
                  <path class="data" {d} />
                </Pancake.SvgLine>
              </Pancake.Svg>

              {#if closest}
                <Pancake.Point x={closest.x} y={closest.y}>
                  <span class="annotation-point {closest.type}-point"></span>
                  <div class="annotation {closest.type}-ann" style="transform: translate(-{100 * (closest.x / (graph.acc.length - 1))}%, 0)">
                    <strong title="aantal">
                      {closest.type === 'in' ? '+' : ''}{closest.y}
                    </strong>
                    {#if closest.ts !== undefined}
                      <span title="tijdstip">
                        {(new Date(closest.ts)).toLocaleTimeString('nl-BE', {hour: '2-digit', minute: '2-digit'})}
                      </span>
                    {/if}
                  </div>
                </Pancake.Point>
              {/if}

              <Pancake.Quadtree data={graph.p} bind:closest />
            </Pancake.Chart>
          </div>
        </Col>
      </Row>
    {/each}
    {#if !graphs_map.size}
      <AwaitNoResults />
    {/if}
  {:catch error}
    <AwaitError {error} />
  {/await}
  {/if}
</TabPane>

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
