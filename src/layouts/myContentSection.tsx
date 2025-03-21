import { css } from "@emotion/css";
import { Component } from "solid-js";
import { Size } from "../property/Size";
import MainMenuSection from "./mainMenuSection";
import { requestSys } from "../systems/Request";
import { Color } from "../property/Color";
import { MapDisplay } from "../components/MapDisplay";
import MyContentProfileSection from "./myContentProfileSection";
import { MapDialog } from "../components/Dialog";
import { dialogSys } from "../systems/DialogControl";
import { mainSys } from "../systems/Main";

const MyContentSectionStyle = css({
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

const MyContentTitleStyle = css({
    // flex
    // position
    // scale
    // text
    fontSize: Size.font.l,
    // color
    // space
    // other
    ":hover": {
        filter: 'brightness(1.12)',
        cursor: 'default'
    }
})

const NumMapLabelStyle = css({
    // flex
    // position
    // scale
    // text
    // color
    color: Color.grayDark,
    // space
    // other
})

const MyContentSection: Component = () => {
    return (
        <div class={MyContentSectionStyle}>
            <MyContentProfileSection />
            <MainMenuSection />
            <div class={NumMapLabelStyle}>전체 {mainSys.numMyMaps()}개</div>
            <div onclick={() => dialogSys.setIsMapDialogOpen(true)}>
                <MapDisplay height={64 + Size.ui.profileW + Size.space.l + Size.space.edge}
                            page="mycontent"></MapDisplay>
            </div>
            <MapDialog />
        </div>
    )
}

export default MyContentSection;