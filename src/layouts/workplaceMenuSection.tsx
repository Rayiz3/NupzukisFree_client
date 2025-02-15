import { css } from "@emotion/css";
import { Component} from "solid-js";
import { workplaceSys } from "../systems/Workplace";
import { Size } from "../property/Size";
import MapElementButton, { MapClearButton } from "../components/MapElementButton";
import { requestSys } from "../systems/Request";
import { ButtonStyle } from "../property/commonStyles";
import { Color } from "../property/Color";
import { IcRun, IcUpload } from "../components/Icons";
import { gameplaySys } from "../systems/Gameplay";

const toolbarStyle = css({
    // flex
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // position
    // scale
    height: Size.ui.workspaceMenuH,
    // text
    // color
    // space
    margin: `${Size.space.l}px 0`,
    gap: Size.space.s,
    // other
});

const LeftMenuStyle = css({
    // flex
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    // position
    // scale
    // text
    // color
    // space
    gap: Size.space.s,
    // other
    overflowX: 'auto',
    scrollbarWidth: 'none',
});

const LeftMenuWrapperStyle = css({
    maxWidth: '80%',
});

const RightMenuStyle = css({
    // flex
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    // position
    // scale
    // text
    // color
    // space
    gap: Size.space.l,
    // other
});

const WorkplaceMenuSection: Component = () => {
    return (
        <div class={toolbarStyle}>
            <div class={LeftMenuWrapperStyle}>
            <div class={LeftMenuStyle}>
                <MapClearButton />
                <MapElementButton element={1} /> {/* eraser */}
                <MapElementButton element={2} /> {/* player */}
                <MapElementButton element={3} /> {/* goalPos */}
                <MapElementButton element={4} /> {/* wall */}
                <MapElementButton element={5} /> {/* enemy */}
                <MapElementButton element={6} /> {/* bomb */}
            </div>
            </div>
            <div class={RightMenuStyle}>
                <button class={ButtonStyle(Size.ui.mapTestButtonW, (workplaceSys.isPlayEnabled())? Color.main : Color.grayDark)}
                        onClick={() => workplaceSys.setShowPlayPopup(true)}
                        disabled={!workplaceSys.isPlayEnabled()}>
                    <IcRun />
                </button>
                <button class={ButtonStyle(Size.ui.mapTestButtonW, (workplaceSys.isSaveEnabled())? Color.main : Color.grayDark)}
                        onClick={() => {
                            requestSys.postMaps(workplaceSys.workingWorld());
                            window.location.href = '/';
                        }}
                        disabled={!workplaceSys.isSaveEnabled()}>
                    <IcUpload />
                </button>
            </div>
        </div>
    )
}

export default WorkplaceMenuSection;