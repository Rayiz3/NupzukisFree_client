import { Accessor, createSignal, Setter } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import { links } from "../property/Link";
import { requestSys } from "./Request";
import { menuNavigatorSys } from "./MenuNavigator";
import { mainSys } from "./Main";

export interface accountType {
    email: string;
    name: string;
    passward: string;
  }

class AccountSys {
    curCreatingAccount: accountType;
    setCurCreatingAccount: SetStoreFunction<accountType>;

    emailError: Accessor<boolean>;
    setEmailError: Setter<boolean>;

    constructor() {
        ([this.curCreatingAccount, this.setCurCreatingAccount] =
            createStore<accountType>({
                email: "",
                name: "",
                passward: "",
        })),
        ([this.emailError, this.setEmailError] = createSignal<boolean>(false))
    }

    // Signup function
    addSignedUser = async () => {
        const { email, passward, name } = accountSys.curCreatingAccount;
        
        // varify if the user input all the information
        if (!email || !passward || !name) {
            console.log("Signup failed: insufficient information");
            accountSys.setEmailError(true);
        }
        else {
            // varify if the email already exist
            const foundUser = await requestSys.getUserByEmail(accountSys.curCreatingAccount.email)
            if (foundUser != null) {
                console.log("email already exist! :", accountSys.curCreatingAccount.email);
                accountSys.setEmailError(true);
            }
            else {
                accountSys.setEmailError(false);
                const newUser = await requestSys.addUser()
                mainSys.setCurUser(newUser.newUser);
                menuNavigatorSys.setCurState("LogedIn");
                window.location.href = links.localhost + "/";
            }
        }
    };

    // Login function
    getLogedinUser = async () => {
        const foundUser = await requestSys.getUserByEmail(accountSys.curCreatingAccount.email)
        
        if (foundUser != null) {
            console.log("login success:", foundUser.name);
            mainSys.setCurUser(foundUser);
            menuNavigatorSys.setCurState("LogedIn");
            window.location.href = links.localhost + "/";
        } else {
            console.log("login failed");
            accountSys.setEmailError(true);
        }
    };
}

    export const accountSys = new AccountSys();