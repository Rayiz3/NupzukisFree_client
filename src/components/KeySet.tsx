import { css } from "@emotion/css";
import { Component, For } from "solid-js";
import { Size } from "../property/Size";
import { Color } from "../property/Color";
import { mainSys } from "../systems/Main";

const KeySetContainerStyle = css({
  display: "flex",
  flex: 1,
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});

const KeySetGridStyle = css({
  display: "grid",
  gridTemplateRows: "repeat(4, 1fr)",
  gridAutoFlow: "column",
  rowGap: Size.space.edge,
  columnGap: 120,
});

const KeySetStyle = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: Size.ui.keySetW,
  height: Size.ui.keySetH,
});

const KeySetLabelStyle = css({
  height: "100%",
  fontSize: Size.font.m,
  textShadow: `1px 1px 2px ${Color.grayLight}`,
  textAlign: "left",
  lineHeight: 2.5,
});

const KeySetBoxStyle = css({
  width: Size.ui.keySetBoxW,
  height: "100%",
  fontSize: Size.font.l,
  textAlign: "center",
  lineHeight: 1.5,
  backgroundColor: Color.gray,
  borderRadius: Size.radius.m,
  boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
  cursor: "pointer",
  overflow: 'clip',
});

const KeySet: Component<{
  keyIndex: number,
  label: string,
  keyValue: string,
}> = ({keyIndex, label, keyValue}) => {
  if(keyValue === "ArrowRight") keyValue = "→";
  else if(keyValue === "ArrowLeft") keyValue = "←";
  else if(keyValue === "ArrowDown") keyValue = "↓";
  else if(keyValue === "ArrowUp") keyValue = "↑";
  else if(keyValue === " ") keyValue = "Space";

  return (
    <div class={KeySetStyle}>
      <div class={KeySetLabelStyle}>{label}</div>
      <div class={KeySetBoxStyle} onClick={() => {mainSys.setCapturing(keyIndex)}}>
        {mainSys.capturingKey() === keyIndex ? "• • •" : keyValue}
      </div>
    </div>
  );
};

const KeySetGrid: Component = () => {
  const label = ["오른쪽", "왼쪽", "아래쪽", "위쪽", "2D", "3D"];

  return (
    <div class={KeySetContainerStyle}>
      <div class={KeySetGridStyle}>
        <For each={mainSys.curUser.keys}>
          {(binding, i) => (
            <KeySet
              keyIndex={i()}
              label={label[i()]}
              keyValue={binding}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export default KeySetGrid;
