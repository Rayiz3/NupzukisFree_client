import { css } from "@emotion/css";
import { Component, Match, Switch } from "solid-js";
import { elementType, workplaceSys } from "../systems/Workplace";
import { Size } from "../property/Size";
import { BlockGoal, BlockEraser, BlockWall, BlockBomb, BlockPlayer, BlockEnemy, BlockClear } from "./Icons";


const MapElementButtonStyle = (isSelected: boolean) => { return css({
    // flex
    // position
    // scale
    boxSizing: 'content-box',
    width: Size.ui.mapElementButton,
    height: Size.ui.mapElementButton,
    // text
    // color
    // space
    backgroundColor: 'transparent',
    // other
    cursor: 'pointer',
    borderRadius: Size.radius.m,
    border: `${isSelected? '5px solid red' : '3px dashed black'}`,
    overflow: 'clip',
  })};

const MapElementButton: Component<{ element: elementType }> = ({element}) => {
    return (
        <div class={MapElementButtonStyle(workplaceSys.selectedType() === element)}
                onClick={() => workplaceSys.setSelectedType(workplaceSys.selectedType() === element? 0 : element)}>
            <BlockImage element={element} />
        </div>
    )
}

export const MapClearButton: Component = () => {
    return (
        <div class={MapElementButtonStyle(false)}
                onClick={() => workplaceSys.clearMap()}>
            <BlockClear />
        </div>
    )
}

export const BlockImage: Component<{element: elementType}> = ({element}) => {
    return (
        <Switch>
            <Match when={element === 1}>
                <BlockEraser></BlockEraser>
            </Match>
            <Match when={element === 2}>
                <BlockPlayer></BlockPlayer>
            </Match>
            <Match when={element === 3}>
                <BlockGoal></BlockGoal>
            </Match>
            <Match when={element === 4}>
                <BlockWall></BlockWall>
            </Match>
            <Match when={element === 5}>
                <BlockEnemy></BlockEnemy>
            </Match>
            <Match when={element === 6}>
                <BlockBomb></BlockBomb>
            </Match>
        </Switch>
    )
}

export default MapElementButton