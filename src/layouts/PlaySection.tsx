import { Component, onMount, createEffect, For, on, Show, onCleanup } from "solid-js";
import { gameplaySys, vector2D } from "../systems/Gameplay";
import { css } from "@emotion/css";
import { Color } from "../property/Color";
import { elementType, workplaceSys } from "../systems/Workplace";
import { Size } from "../property/Size";
import { ClearDialog } from "../components/Dialog";
import { BlockImage } from "../components/MapElementButton";
import Status from "../components/Status";

const PlaySectionStyle = css({
  // flex
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  // scale
  width: '100%',
  height: '100%',
  // other
  overflow: 'auto',
  scrollbarWidth: 'none',
});

const PlayWrapperStyle = () => {
  return css({
  // flex
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  // position
  position: 'relative',
  // scale
  boxSizing: 'border-box',
  width: gameplaySys.mapGridSize().width,
  height: gameplaySys.mapGridSize().height,
  backgroundColor: 'white',
  // other
  border: `3px solid ${Color.mainDark}`,
})}

const MapGridStyle = css({
    // flex
    justifyItems: 'center',
    alignItems: 'center',
    // grid
    display: "grid",
    gridTemplateColumns: `repeat(${Size.world.col}, 1fr)`, // 20 columns
    gridTemplateRows: `repeat(${Size.world.row}, 1fr)`, // 10 rows
    // scale
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
});

const emptyBlockStyle = () => {
    return css({
        // flex
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // position
        // scale
        boxSizing: 'border-box',
        width: gameplaySys.blockSize().width,
        height: gameplaySys.blockSize().height,
        minWidth: Size.world.minBlock,
        aspectRatio: 1,
        // text
        // color
        backgroundColor: 'white',
        // space
        // other
        border: "1px solid",
        borderColor: Color.grayLight,
        borderRadius: Size.radius.m,
        overflow: 'clip'
})};

const BlockStyle = (pos: vector2D, block: elementType) => {
  const blockBorder = (block === 0)
      ? `5px solid ${Color.grayLight}`
      : ([3, 4, 6].includes(block))
          ? '5px solid black'
          : '0px';

  return css({
    // flex
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // position
    position: "absolute",
    left: pos.x * gameplaySys.blockSize().width,
    bottom: pos.y * gameplaySys.blockSize().height,
    // scale
    boxSizing: 'border-box',
    width: gameplaySys.blockSize().width,
    height: gameplaySys.blockSize().height,
    // other
    border: blockBorder,
    borderRadius: Size.radius.l,
    overflow: 'clip',
  });
};

const PlaySection: Component<{isInPopup: boolean}> = ({isInPopup}) => {
  // page play
  onMount(async () => {
    const query = new URLSearchParams(window.location.search);
    const id = Number(query.get("id"));
    if (id) {
      gameplaySys.loadMapById(id);
    }
  })
  
  // popup play
  createEffect(on(workplaceSys.showPlayPopup, () => {
    if (workplaceSys.showPlayPopup()){ // dialog open
      requestAnimationFrame(() => gameplaySys.updateMapGridSize());
      gameplaySys.initialize(workplaceSys.workingWorld());
    } else {  // dialog close
      cancelAnimationFrame(gameplaySys.animationFrameId);
      gameplaySys.animationFrameId = 0;
    }
  }));

  // termination
  createEffect(() => {
    if (gameplaySys.isSuccess()) {
      gameplaySys.terminate(isInPopup);
    }
  });

  // Resize map grid size when window is resized
  createEffect(() => {
      requestAnimationFrame(() => gameplaySys.updateMapGridSize());
      window.addEventListener('resize', gameplaySys.updateMapGridSize);
      onCleanup(() => window.removeEventListener('resize', gameplaySys.updateMapGridSize));
  });

  return (
    <>
    <div id="play-container" class={PlaySectionStyle}>
      <div id="play-wrapper" class={PlayWrapperStyle()}>

        <div class={MapGridStyle}>
          <For each={gameplaySys.world}>
            {() => <div class={emptyBlockStyle()}></div>}
          </For>
        </div>

        <div class={BlockStyle(gameplaySys.player.position, 2)}>
          <BlockImage element={2}></BlockImage>
        </div>
        <div class={BlockStyle(gameplaySys.goalPos, 3)}>
          <BlockImage element={3}></BlockImage>
        </div>
        <For each={gameplaySys.walls}>{(block, _) => 
          <div class={BlockStyle(block, 4)}>
            <BlockImage element={4}></BlockImage>
          </div>
        }</For>
        <For each={gameplaySys.enemies}>{(block, _) => 
          <div class={BlockStyle(block.position, 5)}>
            <BlockImage element={5}></BlockImage>
          </div>
        }</For>
        <For each={gameplaySys.bombs}>{(block, _) => 
          <div class={BlockStyle(block, 6)}>
            <BlockImage element={6}></BlockImage>
          </div>
        }</For>
      </div>
      <Status />
    </div>
    <Show when={!isInPopup}>
      <ClearDialog />
    </Show>
    </>
  );
};

export default PlaySection;
