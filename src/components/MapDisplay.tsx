import { css } from "@emotion/css";
import { Component, For, createResource } from "solid-js";
import { Size } from "../property/Size";
import { requestSys } from "../systems/Request";
import { Color } from "../property/Color";
import { MapDisplayBlockStyle, MapGridStyle } from "../property/commonStyles";
import { mainSys, mapType } from "../systems/Main";

const MapDisplayStyle = (height: number) => {
  return css({
    // grid
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(${Size.ui.mapDisplayW}px, 1fr))`,
    gap: Size.space.m,
    // position
    // scale
    boxSizing: "border-box",
    width: "100%",
    height: `calc(100vh - ${
      Size.space.edge + 64 + Size.ui.buttonH + height
    }px)`,
    // text
    // color
    // space
    marginTop: Size.space.m,
    padding: Size.space.xs,
    // other
    overflow: "auto",
    "::-webkit-scrollbar": {
      width: "0px",
    },
  });
};

const MapCardStyle = css({
  // flex
  // position
  // scale
  width: "100%",
  aspectRatio: "16 / 8",
  // text
  // color
  backgroundColor: Color.grayLight,
  // space
  // other
  borderRadius: Size.radius.m,
  cursor: "pointer",
  boxShadow: "0 0 2px 2px rgba(0, 0, 0, 0.1)",
});

const MapTitleStyle = css({
  // flex
  // position
  position: "absolute",
  top: Size.space.s,
  left: Size.space.s,
  // scale
  // text
  fontWeight: "lighter",
  fontSize: Size.font.l,
  textShadow: `3px 3px 7px ${Color.grayDark}`,
  // color
  color: "black",
  // space
  // other
});

export const MapDisplay: Component<{ height: number; page: string }> = ({
  height,
  page,
}) => {
  const [maps] = createResource(() =>
    (page === "main"
      ? requestSys.getMaps()
      : requestSys.getMapsByEmail(mainSys.curUser.email)
    ).then((fetchedMaps) => fetchedMaps.map((map: mapType) => map))
  );

  const filteredMaps = () =>
    maps()?.filter((map: mapType) =>
      map.name.toLowerCase().includes(mainSys.searchQuery().toLowerCase())
    );

  return (
    <div class={MapDisplayStyle(height)}>
      <For each={filteredMaps()}>
        {(map) => (
          <div
            class={MapCardStyle}
            onclick={ () => {mainSys.updateCurMap(map); }}
          >
            <div class={MapGridStyle}>
              <div class={MapTitleStyle}>{map.name}</div>
              <For each={map.config}>
                {(block) => <div class={MapDisplayBlockStyle(block)}></div>}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};
