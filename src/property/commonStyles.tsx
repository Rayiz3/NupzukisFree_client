import { css } from "@emotion/css";
import { Size } from "./Size";
import { Color } from "./Color";

export const TextboxStyle = (wid: number | string = Size.ui.LoginW, error: boolean = false) => {
  return css({
    // flex
    // position
    // scale
    boxSizing: "border-box",
    width: wid,
    height: Size.ui.textboxH,
    // text
    fontSize: Size.font.xs,
    // color
    backgroundColor: "white",
    // space
    paddingLeft: Size.space.m,
    paddingRight: Size.space.m,
    // other
    border: error? "2px solid red" : "1px solid gray",
    borderColor: Color.gray,
    borderRadius: Size.radius.m,
    boxShadow: error? "0 0 8px red" : "0 0 1px 1px rgba(0, 0, 0, 0.1)",
    transition: "box-shadow 0.3s ease", // Smooth transition
  });
};

export const ButtonStyle = (wid?: number | string, color?: string) => {
  return css({
    // flex
    // position
    // scale
    width: wid,
    height: Size.ui.buttonH,
    // text
    fontSize: Size.font.m,
    textAlign: "center",
    fontWeight: "bold",
    // color
    color: "white",
    backgroundColor: color ? color : Color.main,
    // space
    // other
    border: "none",
    borderRadius: Size.radius.m,
    cursor: "pointer",
    transition: "transform 0.2s ease-in-out",
    ":hover": {
      filter: "brightness(1.12)",
      transform: "scale(1.01)",
    },
    ":active": {
      transform: "scale(0.95)",
    },
    boxShadow: "0 0 4px 4px rgba(0, 0, 100, 0.1)",
  });
};

export const LoginTitleStyle = css({
  // flex
  // position
  // scale
  // text
  fontSize: Size.font.login,
  fontWeight: "bold",
  // color
  // space
  marginTop: 108,
  marginBottom: 80,
  // other
});

export const LoginLabelStyle = css({
  // flex
  // position
  textAlign: "left",
  // scale
  width: Size.ui.LoginW,
  // text
  fontSize: Size.font.m,
  fontWeight: "bold",
  // color
  // space
  marginTop: Size.space.l,
  marginBottom: Size.space.s,
  // other
});

export const ErrorGlowStyle = css({
  border: "2px solid red", // Red border
  boxShadow: "0 0 8px red", // Red glow effect
  transition: "box-shadow 0.3s ease", // Smooth transition
});

export const OverlayStyle = css({
  // flex
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // position
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 1000,
  // scale
  width: "100vw",
  height: "100vh",
  // text
  // color
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  // space
  // other
});

export const MapGridStyle = css({
  display: "grid",
  gridTemplateColumns: `repeat(${Size.world.col}, 1fr)`,
  gridTemplateRows: `repeat(${Size.world.row}, 1fr)`,
  position: "relative",
  gap: "1px",
  width: "100%",
  height: "100%",
});

export const MapDisplayBlockStyle = (blockType: number) => {
  let bgColor = "#fff";
  switch (blockType) {
    case 1:
      bgColor = Color.blockBomb;
      break;
    case 2:
      bgColor = Color.blockStart;
      break;
    case 3:
      bgColor = Color.blockGoal;
      break;
    case 4:
      bgColor = Color.blockWall;
      break;
    case 5:
      bgColor = Color.blockEnemy;
      break;
    default:
      bgColor = "#ffffff";
  }

  return css({
    // scale
    width: "100%",
    height: "100%",
    // color
    backgroundColor: bgColor,
    // other
    borderRadius: Size.radius.m,
  });
};
