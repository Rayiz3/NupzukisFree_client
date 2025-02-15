import { Component } from "solid-js";
import { css } from "@emotion/css";

const BackgroundStyle = css({
    // flex
    position: "fixed",
    // position
    top: 0,
    left: 0,
    zIndex: -1,
    // scale
    width: "100%",
    height: "100%",
    // other
    backgroundImage: `url('/background.svg')`,
    backgroundRepeat: "repeat",
    backgroundSize: "cover",
    animation: "moveBackground 60s linear infinite",
    // Diagonal movement
    "@keyframes moveBackground": {
      "0%": { backgroundPosition: "0 0" },
      "100%": { backgroundPosition: "100% 100%" },
    },
});

const Background: Component = () => {
    return <div class={BackgroundStyle}></div>;
};
  
export default Background;