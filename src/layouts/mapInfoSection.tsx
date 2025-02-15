import { css } from "@emotion/css";
import { Component, For } from "solid-js";
import { Size } from "../property/Size";
import { MapDisplayBlockStyle, MapGridStyle } from "../property/commonStyles";
import { Color } from "../property/Color";
import { PlayButton } from "../components/Button";
import { mainSys } from "../systems/Main";

const MapInfoSectionStyle = css({
    // flex
    display: 'flex',
    flex: 1,
    flexdirection: 'row',
    alignItems: 'center',
    justifyContent: 'start',
    // scale
    height: '100%',
    // space
    gap: Size.space.xl,
})

const MapPreviewStyle = css({
    // scale
    width: '50%',
    aspectRatio: '16 / 8',
    // other
    borderRadius: Size.radius.m,
    boxShadow: "0 0 2px 2px rgba(0, 0, 0, 0.1)",
})

const MapInfoRapperStyle = css({
    // flex
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'start',
    // scale
    aspectRatio: '16 / 8',
})

const MapInfoStyle = css({
    display: 'flex',
    flexDirection: 'column',
    fontSize: Size.font.s,
    alignItems: 'start',
    gap: Size.space.m,
    marginTop: Size.space.s,
})

const MapInfoRowStyle = css({
    display: 'flex',
    flexDirection: 'row',
    gap: Size.space.m,
    color: Color.grayDark,
})

const MapInfoRowHeadStyle = css({
    fontWeight: 'bold',
    width: 90,
    color: Color.main,
})

const MapInfoSection: Component = () => {
    return (
        <div class={MapInfoSectionStyle}>
            <div class={MapPreviewStyle}>
                <div class={MapGridStyle}>
                    <For each={mainSys.curMap.config}>
                        {(block) => <div class={MapDisplayBlockStyle(block)}></div>}
                    </For>
                </div>
            </div>
            <div class={MapInfoRapperStyle}>
                <div class={MapInfoStyle}>
                    <div class={MapInfoRowStyle}>
                        <span class={MapInfoRowHeadStyle}>만든이</span>
                        <span>{mainSys.mapCreator()}</span>
                    </div>
                    <div class={MapInfoRowStyle}>
                        <span class={MapInfoRowHeadStyle}>만든 날짜</span>
                        <span>{mainSys.mapDate()}</span>
                    </div>
                    <div class={MapInfoRowStyle}>
                        <span class={MapInfoRowHeadStyle}>좋아요</span>
                        <span>{mainSys.curMap.rating}</span>
                    </div>
                </div>
                <PlayButton map={mainSys.curMap}>플레이</PlayButton>
            </div>
        </div>
    )
}

export default MapInfoSection;