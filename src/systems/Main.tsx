import { Accessor, createEffect, createSignal, onMount, Setter } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import { requestSys } from "./Request";
import { dialogSys } from "./DialogControl";
import { elementType } from "./Workplace";


export interface accountType {
    email: string;
    name: string;
    passward: string;
}

export interface userType {
    id: number;
    email: string;
    name: string;
    passward: string;
    createdAt: Date;
    keys: string[];
    map: mapType[];
}

export interface mapType {
    name: string;
    id: number;
    createdAt: Date;
    creatorEmail: string;
    rating: number;
    config: elementType[];
}

export type keyType = "Right" | "Left" | "Down" | "Up" | "2D" | "3D";

class MainSys {
    curUser: userType;
    setCurUser: SetStoreFunction<userType>;

    curMap: mapType;
    setCurMap: SetStoreFunction<mapType>;

    numMaps: Accessor<number>;
    setNumMaps: Setter<number>;

    numMyMaps: Accessor<number>;
    setNumMyMaps: Setter<number>;

    mapCreator: Accessor<string>;
    setMapCreator: Setter<string>;

    mapDate: Accessor<string>;
    setMapDate: Setter<string>;

    searchQuery: Accessor<string>;
    setSearchQuery: Setter<string>;
    
    capturingKey: Accessor<number>;
    setCapturingKey: Setter<number>;

    defaultKeySet: string[] = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "2", "3"];
    
    constructor() {
        ([this.curUser, this.setCurUser] = createStore<userType>({
            id: -1,
            email: "",
            name: "",
            passward: "",
            createdAt: new Date(),
            keys: [...this.defaultKeySet],
            map: [],
        })),
        ([this.curMap, this.setCurMap] = createStore<mapType>({
            name: "",
            id: -1,
            createdAt: new Date(),
            creatorEmail: "",
            rating: 0.0,
            config: [],
        })),
        ([this.numMaps, this.setNumMaps] = createSignal<number>(0)),
        ([this.numMyMaps, this.setNumMyMaps] = createSignal<number>(0)),
        ([this.mapCreator, this.setMapCreator] = createSignal<string>("")),
        ([this.mapDate, this.setMapDate] = createSignal<string>("")),
        ([this.searchQuery, this.setSearchQuery] = createSignal<string>("")),
        ([this.capturingKey, this.setCapturingKey] = createSignal<number>(-1)),

        onMount(() => {
            this.loadCurUser();
        });

        // Update localStorage whenever curUser changes
        createEffect(() => {
            localStorage.setItem("curUser", JSON.stringify(this.curUser));
            console.log(this.curUser.name, this.curUser.createdAt);
        });
    }

    loadCurUser = () => {
        const savedUser = localStorage.getItem("curUser");
        if (savedUser) {
            this.setCurUser({
                ...JSON.parse(savedUser),
                createdAt: new Date(JSON.parse(savedUser).createdAt), // Convert string back to Date
            })
        }
    }

    updateCurMap = (map: mapType) => {
        dialogSys.setIsMapDialogOpen(true);
        mainSys.setCurMap(map);

        requestSys.getUserByEmail(map.creatorEmail)
            .then((user) => { mainSys.setMapCreator(user.name); });
        
        const date = new Date(map.createdAt);
        mainSys.setMapDate(`${date.getFullYear()}년 ${date.getMonth()+1}월 ${date.getDate()}일`);
    }

    handleKeyDownOnce = (e: KeyboardEvent) => {
        e.preventDefault();
        if (this.capturingKey() !== -1){
            const updatedKeys = [...this.curUser.keys];
            updatedKeys[this.capturingKey()] = e.key;
            this.setCurUser("keys", updatedKeys);
            
            requestSys.putKeys(this.curUser.email, updatedKeys);

            this.setCapturingKey(-1);
        }
        document.removeEventListener("keydown", this.handleKeyDownOnce);
    };

    setCapturing = (keyIndex: number) => {
        if(this.curUser.id === -1) return;

        if (this.capturingKey() === keyIndex) {
            this.setCapturingKey(-1);
            document.removeEventListener("keydown", this.handleKeyDownOnce);
        }
        else {
            this.setCapturingKey(keyIndex);
            document.addEventListener("keydown", this.handleKeyDownOnce, { once: true });
        }
    };
}

export const mainSys = new MainSys();