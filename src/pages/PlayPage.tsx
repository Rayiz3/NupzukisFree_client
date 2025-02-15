import { Component } from "solid-js";
import { css } from "@emotion/css"
import SideNavigator from "../components/SideNavigator";
import PlaySection from "../layouts/PlaySection";
import { Size } from "../property/Size";

const PlayPageStyle = css({
    // flex
    display: 'flex',
    flexDirection: 'row',
    // scale
    width: '100vw',
    height: '100vh',
})

const PlayWrapperStyle = css({
    // flex
    flex: 1,
    // scale
    width: `calc(100vw - ${Size.navigator.width})`,
    height: '100vh',
})

const PlayPage: Component = () => {
    return (
        <div class={PlayPageStyle}>
            <div class={PlayWrapperStyle}>
                <PlaySection isInPopup={false} />
            </div>
            <SideNavigator/>
        </div>
    );
}

export default PlayPage