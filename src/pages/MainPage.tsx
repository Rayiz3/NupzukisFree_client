import { Component, onMount } from "solid-js";
import { css } from "@emotion/css"
import SideNavigator from "../components/SideNavigator";
import MainSection from "../layouts/mainSection";
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

const MainPage: Component = () => {
    onMount(() => {
        requestSys.getMapsAmount().then((res) => mainSys.setNumMaps(res.mapCount));
        requestSys.getKakaoUserLogedIn();
    });

    return (
        <div class={MainPageStyle}>
            <MainSection/>
            <SideNavigator/>
        </div>
    );
}

export default MainPage