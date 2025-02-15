import { css } from "@emotion/css";
import { Component, createEffect, For, onCleanup, onMount } from "solid-js";
import { elementType, workplaceSys } from "../systems/Workplace";
import { Size } from "../property/Size";
import { Color } from "../property/Color";
import { BlockImage } from "./MapElementButton";

const MapGridSectionStyle = css({
    // flex
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // scale
    width: '100%',
    height: `calc(100vh - ${
      2 * Size.space.edge + 52 + Size.ui.workspaceMenuH + 2 * Size.space.l
    }px)`,
    // other
    overflow: 'auto',
    scrollbarWidth: 'none',
})

// declared as function for the reactivity
const MapGridWrapperStyle = () => {
    return css({
    // flex
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // scale
    width: workplaceSys.mapGridSize().width,
    height: workplaceSys.mapGridSize().height,
    backgroundColor: Color.grayLight,
})}

const MapGridStyle = css({
    justifyItems: 'center',
    alignItems: 'center',
    // grid
    display: "grid",
    gridTemplateColumns: `repeat(${Size.world.col}, 1fr)`, // 20 columns
    gridTemplateRows: `repeat(${Size.world.row}, 1fr)`, // 10 rows
    // position
    // scale
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    // text
    // color
    backgroundColor: Color.grayLight,
    // space
    padding: Size.space.s,
    // other
    borderRadius: Size.radius.l,
});

const BlockStyle = (block: elementType) => {
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
        // scale
        boxSizing: 'border-box',
        width: workplaceSys.blockSize().width,
        height: workplaceSys.blockSize().height,
        minWidth: Size.ui.workspaceMenuH/2,
        aspectRatio: 1,
        // text
        // color
        backgroundColor: 'white',
        // space
        // other
        cursor: "pointer",
        border: blockBorder,
        borderRadius: Size.radius.l,
        overflow: 'clip'
})};

const MapGridSection: Component = () => {
    // Enable play button when both player and goalPos exist
    createEffect((() => {
        workplaceSys.setIsPlayEnabled(workplaceSys.workingWorld().includes(2) &&
                                      workplaceSys.workingWorld().includes(3))
    }));

    // Resize map grid size when window is resized
    createEffect(() => {
        requestAnimationFrame(() => workplaceSys.updateMapGridSize());
        window.addEventListener('resize', workplaceSys.updateMapGridSize);
        onCleanup(() => window.removeEventListener('resize', workplaceSys.updateMapGridSize));
    });

    return (
        <div id="map-grid-container" class={MapGridSectionStyle}>
            <div id="map-grid-wrapper"class={MapGridWrapperStyle()}>
                <div class={MapGridStyle}>
                    <For each={workplaceSys.workingWorld()}>
                        {(block, i) => (
                            <div class={BlockStyle(block)}
                                onClick={() => workplaceSys.handleBlockClick(i())}>
                                <BlockImage element={block} />
                            </div>
                        )}
                    </For>
                </div>
            </div>
        </div>
    )
}

export default MapGridSection