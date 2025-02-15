import { css } from "@emotion/css";
import { Component } from "solid-js";
import { Size } from "../property/Size";
import MainMenuSection from "./mainMenuSection";
import { Color } from "../property/Color";
import { MapDisplay } from "../components/MapDisplay";
import { MapDialog } from "../components/Dialog";
import { mainSys } from "../systems/Main";

const MainSectionStyle = css({
    // flex
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    flex: 1,
    // position
    // scale
    // text
    // color
    // space
    margin: Size.space.edge,
    // other
})

const MainTitleStyle = css({
    // flex
    alignSelf: 'start',
    // position
    // scale
    height: Size.ui.titleH,
    // text
})

const NumMapLabelStyle = css({
    // color
    color: Color.grayDark,
})

const MainSection: Component = () => {
    return (
        <div class={MainSectionStyle}>
            <img class={MainTitleStyle} src="/nupzukisfree_title.svg"></img>
            <MainMenuSection />
            <div class={NumMapLabelStyle}>전체 {mainSys.numMaps()}개</div>
            <MapDisplay height={56 + Size.ui.titleH + Size.space.edge} page="main"/>
            <MapDialog />
        </div>
    )
}

export default MainSection;