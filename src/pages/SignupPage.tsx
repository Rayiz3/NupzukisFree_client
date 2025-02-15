import { Component, onMount } from "solid-js";
import { css } from "@emotion/css";
import { AccountTextbox } from "../components/Textbox";
import { requestSys } from "../systems/Request";
import { ButtonStyle, LoginLabelStyle, LoginTitleStyle } from "../property/commonStyles";
import { Size } from "../property/Size";
import { accountSys } from "../systems/Account";

const SignupPageStyle = css({
    // flex
    display: "flex",
    flexDirection: "column",
    alignItems: 'center',
    // position
    // scale
    // text
    // color
    // space
    // other
})

const SignupPage: Component = () => {
    onMount(() => {
        accountSys.setEmailError(false);
        accountSys.setCurCreatingAccount({
            "email": "",
            "passward": "",
            "name": ""
        });
    })

    return (
        <div class={SignupPageStyle}>
            <p class={LoginTitleStyle}>회원가입</p>

            <p class={LoginLabelStyle}>이메일</p>
            <AccountTextbox message={"something@mail.com"} field="email"></AccountTextbox>

            <p class={LoginLabelStyle}>비밀번호</p>
            <AccountTextbox message={"비밀번호"} field="passward"></AccountTextbox>

            <p class={LoginLabelStyle}>이름</p>
            <AccountTextbox message={"이름"} field="name"></AccountTextbox>

            <button class={`${ButtonStyle(Size.ui.LoginW)} ${css({marginTop: Size.space.xl})}`}
                    onClick={() => accountSys.addSignedUser()}>
                회원가입
            </button>
        </div>
    );
}

export default SignupPage