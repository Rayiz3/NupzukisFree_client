import { Accessor, createEffect, createSignal, Setter } from "solid-js"
import { Size } from "../property/Size";
import { gameplaySys } from "./Gameplay";

// 0: empty, 1: obstacle, 2: start, 3: end, -1: eraser
export type elementType
  = 0 // empty
  | 1 // eraser
  | 2 // player
  | 3 // goalPos
  | 4 // wall
  | 5 // enemy
  | 6 // bomb
  ;

class WorkplaceSys {  
    showPlayPopup: Accessor<boolean>
    setShowPlayPopup: Setter<boolean>

    isPlayEnabled: Accessor<boolean>
    setIsPlayEnabled: Setter<boolean>

    isSaveEnabled: Accessor<boolean>
    setIsSaveEnabled: Setter<boolean>

    workingWorld: Accessor<elementType[]>
    setWorkingWorld: Setter<elementType[]>

    selectedType: Accessor<elementType>
    setSelectedType: Setter<elementType>

    curMapName: Accessor<string>
    setCurMapName: Setter<string>

    mapGridSize: Accessor<{ width: string, height: string }>
    setMapGridSize: Setter<{ width: string, height: string }>

    blockSize:  Accessor<{ width: string, height: string }>
    setBlockSize: Setter<{ width: string, height: string }>

    constructor() {
        ([this.showPlayPopup, this.setShowPlayPopup] = createSignal<boolean>(false)),
        ([this.isPlayEnabled, this.setIsPlayEnabled] = createSignal<boolean>(false)),
        ([this.isSaveEnabled, this.setIsSaveEnabled] = createSignal<boolean>(false)),
        ([this.workingWorld, this.setWorkingWorld] = createSignal<elementType[]>(
          Array(Size.world.col * Size.world.row).fill(0)
        )),
        ([this.selectedType, this.setSelectedType] = createSignal<elementType>(0)),
        ([this.curMapName, this.setCurMapName] = createSignal<string>("이름없는 지도")),
        ([this.mapGridSize, this.setMapGridSize] = createSignal({ width: "100%", height: "100%" })),
        ([this.blockSize, this.setBlockSize] = createSignal({ width: "100%", height: "100%" }))
    }

    updateMapGridSize = () => {
      // wrapper size
      const container = document.getElementById("map-grid-container");
      if (container) {
        const width = Math.max(
          container.clientWidth,
          Size.space.s * 2 + Size.ui.workspaceMenuH/2 * Size.world.col
          //   padding          minimum block size        num of grid
        );
        const height = Math.max(
          container.clientHeight,
          Size.space.s * 2 + Size.ui.workspaceMenuH/2 * Size.world.row
        );
        const ratio = width / height;
    
        if (ratio > 2) {
          // Fit height, adjust width to maintain 2:1 aspect ratio
          this.setMapGridSize({ height: `${height}px`, width: `${height * 2}px` });
        } else {
          // Fit width, adjust height to maintain 2:1 aspect ratio
          this.setMapGridSize({ width: `${width}px`, height: `${width / 2}px` });
        }
      }

      // block size
      // minimum block size is already mentioned at the wrapper size
      const wrapper = document.getElementById("map-grid-wrapper");
      const blockSizeHeight = wrapper? (wrapper.clientHeight - Size.space.s * 2) / Size.world.row : 0;
      const blockSizeWidth = wrapper? (wrapper.clientWidth - Size.space.s * 2) / Size.world.col : 0;
      this.setBlockSize({ width: `${blockSizeWidth}px`, height: `${blockSizeHeight}px`});
    }

    handleBlockClick = (index: number) => {
        const newWorkingWorld = [... this.workingWorld()];
        const currentType = this.selectedType();
    
        // Handle eraser functionality
        if (currentType === 1) {
          newWorkingWorld[index] = 0; // Clear the block
        } else {
          // Ensure only one start and end location
          if (currentType === 2 && newWorkingWorld.includes(2))
            newWorkingWorld[newWorkingWorld.indexOf(2)] = 0;
          if (currentType === 3 && newWorkingWorld.includes(3))
            newWorkingWorld[newWorkingWorld.indexOf(3)] = 0;
          // Update the block type
          newWorkingWorld[index] = currentType;
        }
        
        // reset the game state whenever the map is changed
        gameplaySys.setIsSuccess(false);
        this.setIsSaveEnabled(false);

        this.setWorkingWorld(newWorkingWorld);
    };

    clearMap = () => {
        this.setWorkingWorld(Array(Size.world.col * Size.world.row).fill(0));
        this.setSelectedType(0);
        this.setIsSaveEnabled(false);
    }
}

export const workplaceSys = new WorkplaceSys()