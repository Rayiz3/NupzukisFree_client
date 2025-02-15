import { Component, onMount } from "solid-js";
import MyContentSection from "../layouts/myContentSection";
import SideNavigator from "../components/SideNavigator";
import { css } from "@emotion/css";
import { requestSys } from "../systems/Request";
import { mainSys } from "../systems/Main";

const MainPageStyle = css({
    // flex
    display: 'flex',
    flexDirection: 'row',
    // position
    // scale
    width: '100vw',
    height: '100vh',
    // text
    // color
    // space
    // other
})

const MycontentPage: Component = () => {
    onMount(async () => {
        await requestSys
          .getMapsAmountByEmail(mainSys.curUser.email)
          .then((res) => mainSys.setNumMyMaps(res.mapCount));
      });
    return (
        <div class={MainPageStyle}>
            <MyContentSection/>
            <SideNavigator/>
        </div>
    );
}

export default MycontentPage