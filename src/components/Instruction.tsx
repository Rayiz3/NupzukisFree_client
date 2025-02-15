import { css } from "@emotion/css";
import { Component, JSXElement, Match, Switch } from "solid-js"
import { Size } from "../property/Size";
import { elementType } from "../systems/Workplace";
import { BlockBomb, BlockEnemy, BlockGoal, BlockWall } from "./Icons";

const InstructionStyle = css({
    // grid
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gridAutoFlow: "row",
    rowGap: Size.space.edge,
    columnGap: Size.space.edge,
    // scale
    width: '100%',
    // space
    marginTop: Size.space.edge,
})

const InstructionBlockStyle = css({
    // flex
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'start',
    // space
    gap: Size.space.l,
})

const ModeInstructionStyle = css({
    // flex
    display: 'flex',
    flexDirection: 'row',
    // scale
    width: '100%',
    // space
    gap: Size.space.l,
    marginTop: Size.space.edge,
})

const ModeDescriptionContainerStyle = css({
    // flex
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    // space
    gap: Size.space.m,
})

const BlockStyle = (block: elementType) => {
    const blockBorder = ([3, 4, 6].includes(block))
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
        width: Size.ui.workspaceMenuH,
        height: Size.ui.workspaceMenuH,
        minWidth: Size.ui.workspaceMenuH/2,
        aspectRatio: 1,
        // text
        // color
        // space
        // other
        border: blockBorder,
        borderRadius: Size.radius.l,
        overflow: 'clip'
})};

const descriptionStyle = css({
    // flex
    flex: 1,
    // text
    textAlign: 'left',
    fontsize: Size.font.m,
})

const InstructionBlock: Component<{
    block: elementType,
    children: JSXElement
}> = ({block, children}) => {
    return(
        <div class={InstructionBlockStyle}>
            <div class ={BlockStyle(block)}>
                <Switch>
                    <Match when={block === 3}>
                        <BlockGoal />
                    </Match>
                    <Match when={block === 4}>
                        <BlockWall />
                    </Match>
                    <Match when={block === 5}>
                        <BlockEnemy />
                    </Match>
                    <Match when={block === 6}>
                        <BlockBomb />
                    </Match>
                </Switch>
            </div>
            <div class={descriptionStyle}>{children}</div>
        </div>
    )
}

export const Instruction: Component = () => {
  return (
    <div class={InstructionStyle}>
        <InstructionBlock block={3}>
            넙죽이가 도달해야 하는 목적지입니다. 목적지에 도달하면, 실험이 종료됩니다!
        </InstructionBlock>
        <InstructionBlock block={4}>
            벽은 넙죽이가 통과할 수 없어요. 2D 모드에서는 넙죽이가 딛고 올라설 수 있습니다.
        </InstructionBlock>
        <InstructionBlock block={5}>
            나쁜 흑죽이들을 피해가세요. 2D 모드에서는 좌우로 움직이지만, 3D 모드에서는 가까이 가면 넙죽이를 쫒아옵니다!
        </InstructionBlock>
        <InstructionBlock block={6}>
            조심, 폭탄에 닿는 순간 공중 분해 되어 버려요!
        </InstructionBlock>
    </div>
  )
}

export const ModeInstruction: Component = () => {
    return(
        <div class={ModeInstructionStyle}>
            <div class={ModeDescriptionContainerStyle}>
                <img src="/mode_2d.svg" />
                <div>
                    2D 모드에서는 좌우 이동, 점프로 조작할 수 있습니다.
                </div>
            </div>
            <div class={ModeDescriptionContainerStyle}>
                <img src="/mode_3d.svg" />
                <div>
                    3D 모드에서는 상하 좌우 이동이 가능합니다. 중력의 영향을 받지 않습니다.
                </div>
            </div>
        </div>
    )
}