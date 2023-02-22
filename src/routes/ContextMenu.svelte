<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import allNodes, { NodeInstance } from "./lib/Nodes/Nodes";
  import { contextVisible, mouseClicks } from "./store";

  const nodes = allNodes;
  const dispatch = createEventDispatcher();
  $: nodes_by_category = nodes.reduce((prev, curr) => {
    for (const cat of curr.categories) {
      if (!prev[cat]) {
        prev[cat] = [];
      }
      prev[cat].push(curr);
    }
    return prev;
  }, {} as Record<string, INode[]>);
  $: categories = Object.keys(nodes_by_category);

  function handleNewNode(node: INode) {
    let { categories, title, description, inputs, outputs, compute } = node;
    let deepCopy = JSON.parse(
      JSON.stringify({ categories, title, description, inputs, outputs })
    );
    deepCopy.compute = compute;
    let nodeInstance = new NodeInstance(deepCopy);
    dispatch("addNode", nodeInstance);
  }
</script>

<ul
  class="menu bg-base-100 w-56 p-2 rounded-box absolute"
  style="top:{$mouseClicks.down?.clientY}px;left:{$mouseClicks.down
    ?.clientX}px;"
  class:hidden={!$contextVisible}
  id="ctxmenu"
>
  {#each categories as category}
    <li class="menu-title">
      <span class="capitalize">{category}</span>
    </li>
    {#each nodes_by_category[category] as node}
      <!-- svelte-ignore a11y-missing-attribute -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        on:click={() => {
          handleNewNode(node);
        }}
      >
        <a>{node.title}</a>
      </li>
    {/each}
  {/each}
</ul>
