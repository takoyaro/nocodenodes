<script lang="ts">
  import {
    contextVisible,
    iH,
    isPanning,
    iW,
    keyEvents,
    mouse,
    mouseClicks,
    viewBox,
    Zoom,
  } from "./store";

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key == " " && !$isPanning) isPanning.set(true);
  }
  function handleKeyUp(e: KeyboardEvent) {
    keyEvents.set(e);
    if (e.key == " " && $isPanning) {
      isPanning.set(false);
    }
    if (e.code == "Space" && e.shiftKey == true && e.altKey == true) {
      viewBox.set([0, 0]);
    }
  }
  function handleMove(e: MouseEvent) {
    mouse.set(e);
    if ($isPanning && e.buttons) {
      const viewboxX_delta = e.movementX * -1 * $Zoom;
      viewBox.set([
        ($viewBox[0] += viewboxX_delta),
        ($viewBox[1] += e.movementY * -1 * $Zoom),
      ]);
    }
  }
  function handleZoom(e: WheelEvent) {
    let zoomDelta = e.deltaY / 10;
    if (zoomDelta > 0 || zoomDelta < 0) {
      Zoom.set(($Zoom += e.deltaY / 100));
    }
  }
  function handleContext() {
    contextVisible.set(true);
  }
  function isContextMenu(el: EventTarget | null) {
    let ctxmenu = window.document.getElementById("ctxmenu");
    let target = el as HTMLElement | null;
    if (target) {
      target = target.parentElement;
    }
    let childNodes = ctxmenu?.children;
    if (childNodes !== undefined && target) {
      if (![...childNodes].includes(target)) {
        return false;
      }
    }
    return true;
  }
  function handleMouseDown(e: MouseEvent) {
    if (!isContextMenu(e.target)) {
      $mouseClicks.down = e;
      contextVisible.set(false);
    }
  }
</script>

<svelte:window
  bind:innerWidth={$iW}
  bind:innerHeight={$iH}
  on:keydown={handleKeyDown}
  on:keyup={handleKeyUp}
  on:mousemove={handleMove}
  on:mousedown={handleMouseDown}
  on:mouseup={() => {
    $mouseClicks.down = null;
  }}
  on:contextmenu|preventDefault|stopPropagation={handleContext}
  on:wheel={handleZoom}
/>
