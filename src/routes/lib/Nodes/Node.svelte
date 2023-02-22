<svelte:options accessors={true} />

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { mouse, mouseClicks, nodes, viewBox, Zoom } from "../../store";
  import { ECategories } from "./ENUMS";
  import type { NodeInstance } from "./Nodes";

  export let NodeDef: NodeInstance;
  export let uuid: string;

  const dispatch = createEventDispatcher();
  const padding = 8; //0.5rem
  $: inputCount = NodeDef.inputs.length;
  $: outputCount = Array.isArray(NodeDef.outputs)
    ? NodeDef.outputs.length ?? 0
    : 1;
  $: height = padding * (Math.max(inputCount, outputCount) * 32);

  let nodeWidth = 256;
  let isDragging = false;
  let titleNode: HTMLHeadingElement;
  let dragStartLocation = [0, 0];
  export let [nodeX, nodeY] = [
    parseInt(`${$viewBox[0] + $mouse.clientX - nodeWidth / 2}`),
    parseInt(`${$viewBox[1] + $mouse.clientY}`),
  ];
  mouseClicks.subscribe((e) => {
    if (e) {
      if (e.down?.buttons) {
        //mouseDown
        if (e.down?.target == titleNode) {
          isDragging = true;
          dragStartLocation = [e.down?.pageX, e.down?.pageY];
        }
      } else {
        //mouseUp
        if (isDragging) {
          isDragging = false;
        }
      }
    }
  });
  mouse.subscribe((e) => {
    if (isDragging) {
      nodeX += e.movementX * $Zoom;
      nodeY += e.movementY * $Zoom;
    }
  });

  export function updateConnections() {
    console.log("Updating connection from ", uuid);
    for (let index = 0; index < NodeDef.inputs.length; index++) {
      const conn = NodeDef.inputs[index];
      if (conn.from) {
        const matchingOutputs = [...$nodes].filter(([, n]) => {
          return n.NodeDef.outputs.some((p) => p.to == NodeDef.UUID);
        });
        console.log(
          "Propagating from ",
          conn.from,
          " to some of ",
          matchingOutputs
        );
        //set the value of conn.value to the matching [index] from the conn.from.output matching the uuid
        let node = $nodes.get(conn.from);
        conn.value = node?.NodeDef.outputs
          .filter((o) => o.to == uuid)
          .at(0)?.value;
      }
    }
    for (let index = 0; index < NodeDef.outputs.length; index++) {
      const conn = NodeDef.outputs[index];
      if (conn) {
        if (conn.to) {
          let node = $nodes.get(conn.to);
          node?.updateConnections();
          //Do I really need this if I do the line 47 properly ?
        }
      }
    }
    compute();
  }
  export function compute() {
    let values: TIO[] = NodeDef.compute(NodeDef) as TIO[];
    nodes.set($nodes);
    for (let o = 0; o < NodeDef.outputs.length; o++) {
      NodeDef.outputs[o].value = values[o];
    }
  }
  function handleLinkTo(pinIndex: number) {
    dispatch("LinkTo", { uuid, pinIndex });
  }
  function handleLinkFrom(pinIndex: number) {
    dispatch("LinkFrom", { uuid, pinIndex });
  }
</script>

<g style="translate:{nodeX}px {nodeY}px;" id={uuid}>
  <!-- {#each NodeDef.inputs as input,i}
        <circle r="8" cx={nodeX-padding-16-8} cy="{padding+(32*i)+8+4}"/>
    {/each} -->
  <foreignObject width={nodeWidth} {height} x="0" y="0">
    <div class="node">
      <h2 bind:this={titleNode}>{NodeDef.title}</h2>
      {#if inputCount > 0}
        {#each NodeDef.inputs as input, i}
          {@const pinHeight = padding * 2}
          {@const inputTotalPadding = pinHeight * 2}
          {@const nodePadding = padding * 2}
          {@const nodeMargin = padding * 2}
          {@const posFromTopToInputTop = padding + nodePadding + nodeMargin}
          {@const InputIndexHeight = inputTotalPadding * i}
          {@const pinIndexAdjustment = i * pinHeight}
          {@const TotalPositionFromTop =
            posFromTopToInputTop + InputIndexHeight + pinIndexAdjustment}
          {@const hasConnectionIn = input.from !== null}
          <div class="flex flex-row">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
              class="pin inpin -ml-6 mr-4 mt-4"
              class:strpin={input.type == "string"}
              class:intpin={input.type == "integer"}
              class:floatpin={input.type == "float"}
              class:numpin={input.type == "number"}
              class:boolpin={input.type == "boolean"}
              class:datepin={input.type == "date"}
              class:plugged={hasConnectionIn}
              style="top:{TotalPositionFromTop + 4}px;left:0.5rem;"
              on:click={() => {
                handleLinkTo(i);
              }}
            />
            <input
              placeholder={input.label}
              bind:value={input.value}
              on:keyup={updateConnections}
              disabled={hasConnectionIn}
              class:input-disabled={hasConnectionIn}
            />
          </div>
        {/each}
      {:else if NodeDef.categories.includes(ECategories.CONSTS)}
        <input
          placeholder={NodeDef.outputs[0].label}
          style="width:{nodeWidth / 2}px;"
          bind:value={NodeDef.outputs[0].value}
          on:keyup={updateConnections}
        />
      {/if}
      {#each NodeDef.outputs as output, i}
        {@const indexAdjustment = i + 1}
        {@const pinHeight = padding * 2}
        {@const pinIndexAdjustment = indexAdjustment * pinHeight}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="pin outpin absolute"
          class:strpin={output.type == "string"}
          class:intpin={output.type == "integer"}
          class:floatpin={output.type == "float"}
          class:numpin={output.type == "number"}
          class:boolpin={output.type == "boolean"}
          class:datepin={output.type == "date"}
          style="right:0.5rem;top:{pinIndexAdjustment + pinHeight * 2 - 4}px"
          on:click={() => {
            handleLinkFrom(i);
          }}
        />
        <!-- <circle r="8" cx="{nodeWidth}" cy="{32+4}"/> -->
      {/each}
      <span>Inputs:{NodeDef.inputs.map((i) => i.value)}</span>
      <span>Outputs:{NodeDef.outputs.map((o) => o.value)}</span>
      <small>{NodeDef.UUID}</small>
    </div>
  </foreignObject>
</g>

<style lang="postcss">
  @import url("https://fonts.googleapis.com/css2?family=Abel:wght@400&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Advent+Pro:wght@100;200;300;400;500;600;700&display=swap");

  h2 {
    @apply text-indigo-400 text-2xl;
    position: absolute;
    top: 0rem;
    text-transform: uppercase;
    font-family: "Advent Pro";
    font-weight: 800;
    user-select: none;
  }
  .node {
    @apply bg-base-100;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 1rem;
    border-radius: 8px;
  }
  circle {
    fill: var(--dark-400);
  }
  circle:hover {
    fill: var(--dark-500);
  }
  input {
    @apply input input-bordered w-full;
    border-radius: 5px;
    padding: 8px;
  }
  .pin {
    border-radius: 50%;
    width: 1rem;
    height: 1rem;
    transition: all 300ms;
    border: 2px solid hsl(0deg, 0%, 0%, 0);
  }
  .pin.plugged {
    @apply bg-primary;
  }
  .pin.strpin {
    @apply bg-str-500;
  }
  .pin.intpin {
    @apply bg-int-500;
  }
  .pin.floatpin {
    @apply bg-float-500;
  }
  .pin.numpin {
    @apply bg-num-500;
  }
  .pin.boolpin {
    @apply bg-bool-500;
  }
  .pin.datepin {
    @apply bg-date-500;
  }
  .pin:hover {
    background: var(--dark-500);
    border-color: var(--primary-700);
    scale: 1.1;
  }
</style>
