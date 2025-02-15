import { links } from "../property/Link";
import { menuNavigatorSys } from "./MenuNavigator";
import { workplaceSys } from "./Workplace";
import { dialogSys } from "./DialogControl";
import { accountSys } from "./Account";
import { mainSys } from "./Main";

class RequestSys {

  ////// users //////
  
  getUsers = async () => {
    const response = await fetch(links.serverAddress + "/users")
    return response.json(); // userType[]
  };

  addUser = async () => {
    const response = await fetch(links.serverAddress + "/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(accountSys.curCreatingAccount),
    })
    return response.json(); // { newUser: userType }
  };

  ////// user //////

  getUserByEmail = async (email: string) => {
    if (email === ""){
      return null;
    }
    const response = await fetch(links.serverAddress + "/user?email=" + encodeURIComponent(email))
    return response.json(); // userType
  };

  ////// account //////

  getKakaoUser = async () => {
    window.location.href = links.serverAddress + "/auth/kakao";
  };

  getKakaoUserLogedIn = async () => {
    const query = new URLSearchParams(window.location.search);
    const email = query.get("email");

    const foundUser = await this.getUserByEmail(email ? email : "");

    if (foundUser != null) {
      console.log("login success:", foundUser);
      menuNavigatorSys.setCurState("LogedIn");
      mainSys.setCurUser("id", foundUser.id);
      mainSys.setCurUser("email", foundUser.email);
      mainSys.setCurUser("passward", foundUser.passward);
      mainSys.setCurUser("name", foundUser.name);
      mainSys.setCurUser("createdAt", foundUser.createdAt);
      console.log("info stored:", mainSys.curUser.name);
    }
  };

  ////// maps //////

  getMaps = async () => {
    const response = await fetch(links.serverAddress + "/maps")
    return response.json();
  };

  getMapsByEmail = async (email: string) => {
    const response = await fetch(links.serverAddress + "/maps?email="+encodeURIComponent(email))
    return response.json();
  };

  getMapsAmount = async () => {
    const response = await fetch(links.serverAddress + "/maps/amount")
    return response.json();
  };

  getMapsAmountByEmail = async (email: string) => {
    const response = await fetch(links.serverAddress + "/maps/amount?email="+encodeURIComponent(email))
    return response.json();
  };

  postMaps = async (map: number[]) => {
    const response = await fetch(links.serverAddress + "/maps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: workplaceSys.curMapName(),
        creatorEmail: mainSys.curUser.email,
        config: map,
      }),
    })
    return response.json();
  };

  ////// map //////

  getMapById = async (id: number) => {
    const response = await fetch(links.serverAddress + "/map?id="+id)
    return response.json();
  };

  increaseRating = async (id: number) => {
    const response = await fetch(links.serverAddress + "/map/rating", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        increment: dialogSys.isLike()? 1 : 0
      }),
    });
    return response.json();
  };

  ////// keys //////

  putKeys = async (email: string, keys: string[]) => {
    console.log("putKeys", email, keys);
    const response = await fetch(links.serverAddress + "/keys", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        keys: keys
      }),
    });
    return response.json();
  };
}

export const requestSys = new RequestSys();
