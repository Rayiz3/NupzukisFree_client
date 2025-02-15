import { Component } from "solid-js";
import { css } from "@emotion/css";
import SideNavigator from "../components/SideNavigator";
import WorkplaceSection from "../layouts/workplaceSection";

const WorkplacePageStyle = css({
  // flex
  display: "flex",
  flexDirection: "row",
  // scale
  width: '100vw',
  height: '100vh',
});

const WorkplacePage: Component = () => {

  return (
    <div class={WorkplacePageStyle}>
      <WorkplaceSection/>
      <SideNavigator />
    </div>
  );
};

export default WorkplacePage;
