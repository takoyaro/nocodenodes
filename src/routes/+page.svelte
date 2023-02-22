<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import {
    contextVisible,
    iH,
    isPanning,
    iW,
    LinkBuilder,
    mouse,
    nodes,
    viewBox,
    Zoom,
  } from "./store";
  import NodeComponent from "./lib/Nodes/Node.svelte";
  import type { NodeInstance } from "./lib/Nodes/Nodes";
  import MouseHandler from "./MouseHandler.svelte";
  import ContextMenu from "./ContextMenu.svelte";

  let svg: SVGElement;
  let debugMode = false;
  function handleNewNode(e: { detail: NodeInstance }) {
    const uuid = uuidv4();
    const def = e.detail;
    def.UUID = uuid;
    const newNode = new NodeComponent({
      target: svg,
      props: {
        NodeDef: def,
        uuid: uuid,
      },
    });
    newNode.$on("LinkTo", ({ detail }) => {
      const { uuid, pinIndex } = detail;
      const potentialNode = $nodes.get(uuid);
      //If we have 2 connections, create an edge.
      if ($LinkBuilder.from.node && potentialNode !== undefined) {
        const nodeFrom = $nodes.get(
          $LinkBuilder.from.node.uuid
        ) as NodeComponent;
        if ($LinkBuilder.from.pinIndex !== null) {
          nodeFrom.NodeDef.setOutputTo(
            $LinkBuilder.from.pinIndex,
            potentialNode.NodeDef.UUID
          );
          potentialNode.NodeDef.setInputFrom(pinIndex, nodeFrom.NodeDef.UUID);
        } else {
          console.log(
            "Pin Index issue for ",
            $LinkBuilder.from.node.NodeDef.UUID
          );
        }
        // potentialNode.NodeDef.inputs[pinIndex].from = nodeFrom.uuid;
        potentialNode.updateConnections();
        nodeFrom.updateConnections();
        LinkBuilder.set({
          from: {
            node: null,
            pinIndex: null,
          },
          to: {
            node: null,
            pinIndex: null,
          },
        });
      } else {
        $LinkBuilder.to = {
          node: potentialNode,
          pinIndex,
        };
      }
      console.log($nodes);
      nodes.set($nodes);
    });
    newNode.$on("LinkFrom", ({ detail }) => {
      console.log("Linking from ", detail);
      const { uuid, pinIndex } = detail;
      const potentialNode = $nodes.get(uuid);
      $LinkBuilder.from = {
        node: potentialNode,
        pinIndex,
      };
      const nodeEl = document.getElementById(
        $LinkBuilder.from.node?.uuid as string
      );
      console.log($LinkBuilder, nodeEl, nodeEl?.querySelectorAll(".outpin"));
      nodes.set($nodes);
    });
    $nodes.set(uuid, newNode);
    nodes.set($nodes);
    contextVisible.set(false);
  }
  $: isLinkingFrom = $LinkBuilder.from.node !== null && document;
  $: isLinkingTo = $LinkBuilder.to.node !== null && document;

  function getPinOffsets(
    whichPin: "in" | "out",
    conn: NodeComponent | undefined | null = null,
    pinIndex: number | null = null
  ) {
    const uuid = conn
      ? conn.uuid
      : whichPin == "in"
      ? $LinkBuilder.to.node?.uuid
      : $LinkBuilder.from.node?.uuid;
    if (pinIndex == null) {
      whichPin == "in" ? $LinkBuilder.to.pinIndex : $LinkBuilder.from.pinIndex;
    }
    const nodeEl = document.getElementById(uuid as string);
    const nodeTranslation = nodeEl?.style.translate
      .replace(/px/g, "")
      .split(" ");
    const pinEl: HTMLDivElement = nodeEl
      ?.querySelectorAll(`.${whichPin}pin`)
      .item(pinIndex as number) as HTMLDivElement;
    const pinOffsets = [pinEl?.offsetLeft, pinEl?.offsetTop];
    const XOffset =
      parseInt(nodeTranslation?.at(0) ?? "0") +
      (pinOffsets.at(0) as number) +
      8;
    const YOffset =
      parseInt(nodeTranslation?.at(1) ?? "0") +
      (pinOffsets.at(1) as number) +
      8;
    return [XOffset, YOffset];
  }

  function NodeFromUUID(uuid: string | undefined) {
    return $nodes.get(uuid as string) as NodeComponent;
  }
</script>

<MouseHandler />
<ContextMenu on:addNode={handleNewNode} />
<svg
  width="{$iW}px"
  height="{$iH}px"
  class:pan={$isPanning}
  viewBox="{$viewBox[0]} {$viewBox[1]} {$iW * $Zoom} {$iH * $Zoom}"
  bind:this={svg}
>
  <defs>
    <pattern
      id="smallGrid"
      width="30"
      height="30"
      patternUnits="userSpaceOnUse"
    >
      <path
        d="M 30 0 L 0 0 0 30"
        fill="none"
        stroke="gray"
        stroke-width="0.5"
      />
    </pattern>
    <pattern id="grid" width="300" height="300" patternUnits="userSpaceOnUse">
      <rect width={3000 * $Zoom} height={3000 * $Zoom} fill="url(#smallGrid)" />
    </pattern>
  </defs>
  <rect
    x={$viewBox[0]}
    y={$viewBox[1]}
    width="{$iW * $Zoom}px"
    height="{$iH * $Zoom}px"
    fill="url(#grid)"
  />
  {#if isLinkingTo}
    {@const [XOffset, YOffset] = getPinOffsets("in")}
    <!-- <text x=20 y=20 fill=white>{$mouse.clientX},{$mouse.clientY}->{nodeEl?.style.translate}-----[{pinOffsets}]</text> -->
    <path
      fill="none"
      stroke="red"
      d="M{$mouse.clientX},{$mouse.clientY} C{$mouse.clientX +
        (XOffset - $mouse.clientX) / 3},{$mouse.clientY} {XOffset -
        XOffset / 3},{YOffset} {XOffset},{YOffset}"
    />
  {/if}
  {#if isLinkingFrom}
    {@const [XOffset, YOffset] = getPinOffsets("out")}
    {@const mouseGapX = $mouse.clientX - XOffset}
    {#if debugMode}
      <circle r="8" fill="pink" cx={XOffset + mouseGapX / 3} cy={YOffset} />
      <circle
        r="8"
        fill="pink"
        cx={$mouse.clientX + (XOffset - $mouse.clientX) / 3}
        cy={$mouse.clientY}
      />
    {/if}
    <path
      class="fill-none stroke-primary stroke-2"
      fill="none"
      stroke="red"
      d="M{XOffset},{YOffset} C{XOffset +
        mouseGapX / 3},{YOffset} {$mouse.clientX +
        (XOffset - $mouse.clientX) /
          3},{$mouse.clientY} {$mouse.clientX},{$mouse.clientY}"
    />
  {/if}
  {#each [...$nodes] as [uuid, FromNode], i}
    {#if Array.isArray(FromNode.NodeDef.outputs)}
      {#each FromNode.NodeDef.outputs as ToNode, pinIndex}
        {#if ToNode.to !== null && ToNode !== undefined}
          {@const toPinIndex = NodeFromUUID(ToNode.to)
            ?.NodeDef.inputs.map((n, i) => (n.from == uuid ? i : -1))
            .filter((n) => n >= 0)[0]}
          {@const [from_XOffset, from_YOffset] = getPinOffsets(
            "out",
            FromNode,
            pinIndex
          )}
          {@const [to_XOffset, to_YOffset] = getPinOffsets(
            "in",
            NodeFromUUID(ToNode.to),
            toPinIndex
          )}
          {@const xgap = to_XOffset - from_XOffset}
          {#key $mouse}
            <path
              class="fill-none stroke-primary stroke-2"
              fill="none"
              stroke="red"
              d="M{from_XOffset},{from_YOffset} C{from_XOffset +
                xgap / 3},{from_YOffset} {to_XOffset -
                xgap / 3},{to_YOffset} {to_XOffset},{to_YOffset}"
            />
            {#if debugMode}
              <circle
                class="fill-red-500"
                r="8"
                cx={from_XOffset}
                cy={from_YOffset}
              />
              <circle
                class="fill-yellow-500"
                r="8"
                cx={from_XOffset + xgap / 3}
                cy={from_YOffset}
              />
              <circle
                class="fill-yellow-500"
                r="8"
                cx={to_XOffset - xgap / 3}
                cy={to_YOffset}
              />
              <circle
                class="fill-red-500"
                r="8"
                cx={to_XOffset}
                cy={to_YOffset}
              />
            {/if}
          {/key}
        {/if}
      {/each}
    {:else}
      <circle class="fill-red-500" r="8" cx={32} cy={32} />
    {/if}
  {/each}
</svg>

<style>
  :global(html, body) {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
  .pan {
    cursor: grabbing;
  }
  svg {
    background: rgb(23, 33, 45);
  }
</style>
