import { Component, onMount } from "solid-js";
import { css } from "@emotion/css";
import { AccountTextbox } from "../components/Textbox";
import { requestSys } from "../systems/Request";
import { ButtonStyle, LoginLabelStyle, LoginTitleStyle } from "../property/commonStyles";
import { Size } from "../property/Size";
import { Color } from "../property/Color";
import { links } from "../property/Link";
import { accountSys } from "../systems/Account";

const LoginPageStyle = css({
    // flex
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
})

const buttonStyle = css({
    // flex
    // position
    // scale
    // text
    textDecoration: 'underline',
    fontColor: Color.gray,
    // color
    backgroundColor: 'transparent',
    // space
    marginTop: Size.space.l,
    // other
    border: 'none',
    cursor: 'pointer',

    ":hover": {
        filter: 'brightness(1.12)',
    }
})

const kakaoButtonStyle = css({
    // flex
    // position
    // scale
    width: Size.ui.LoginW,
    // text
    // color
    // space
    // other
    cursor: "pointer",
    ":hover": {
        filter: 'brightness(1.02)',
    }
  });

const LabelStyle = css({
    // flex
    // position
    // scale
    // text
    // color
    color: Color.gray,
    // space
    marginTop: Size.space.l,
    marginBottom: 0,
    // other
  });

const LoginPage: Component = () => {
  onMount(() => {
    accountSys.setCurCreatingAccount({
      email: "",
      passward: "",
      name: "",
    });
  });

    return (
        <div class={LoginPageStyle}> 

            <p class={LoginTitleStyle}>로그인</p>

            <img src='/kakao_login_large_wide.png'
                 class={kakaoButtonStyle}
                 onClick={requestSys.getKakaoUser}/>

            <p class={LabelStyle}>또는</p>
            
            <p class={LoginLabelStyle}>이메일</p>
            <AccountTextbox message={"something@mail.com"} field="email" error={accountSys.emailError()}></AccountTextbox>
            
            <p class={LoginLabelStyle}>비밀번호</p>
            <AccountTextbox message={"비밀번호"} field="passward" error={accountSys.emailError()}></AccountTextbox>

            <button class={`${ButtonStyle(Size.ui.LoginW)} ${css({marginTop: Size.space.xl})}`}
                    onClick={accountSys.getLogedinUser}>
                로그인
            </button>
            <button class={buttonStyle}
                    onClick={() => window.location.href = links.localhost + "/signup"}>
                회원가입
            </button>
        </div>
    );
}

export default LoginPage