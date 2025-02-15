import { css } from "@emotion/css";
import { Component } from "solid-js";
import { gameplaySys } from "../systems/Gameplay";
import { Size } from "../property/Size";


const StatusStyle = css({
    // flex
    display: "flex",
    flexDirection: "row",
    // position
    // scale
    // text
    // color
    color: "black",
    backgroundColor: "white",
    // space
    gap: Size.space.l,
    // other
    borderRadius: "5px",
})

const Status: Component = () => {
    return (
        <div class={StatusStyle}>
            <div>
                Mode: {gameplaySys.is3DMode() ? "3D" : "2D"}
            </div>
            <div>
                {"Your Attempts: " + gameplaySys.deathCnt()}
            </div>
        </div>
    )
}

export default Status