import { Accessor, createSignal, Setter } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import { Size } from "../property/Size";
import { requestSys } from "./Request";
import { mainSys } from "./Main";
import { elementType, workplaceSys } from "./Workplace";

export interface vector2D {
  x: number;
  y: number;
}

export interface agent {
  position: vector2D;
  velocity: vector2D;
}

class GameplaySys {
  world: number[];
  setWorld: SetStoreFunction<elementType[]>;

  startPos: vector2D;
  setStartPos: SetStoreFunction<vector2D>;

  goalPos: vector2D;
  setGoalPos: SetStoreFunction<vector2D>;

  player: agent;
  setPlayer: SetStoreFunction<agent>;

  bombs: vector2D[];
  setBombs: SetStoreFunction<vector2D[]>;

  walls: vector2D[];
  setWalls: SetStoreFunction<vector2D[]>;

  enemies: agent[];
  setEnemies: SetStoreFunction<agent[]>;

  isSuccess: Accessor<boolean>;
  setIsSuccess: Setter<boolean>;

  isJumping: Accessor<boolean>;
  setIsJumping: Setter<boolean>;

  is3DMode: Accessor<boolean>;
  setIs3DMode: Setter<boolean>;

  deathCnt: Accessor<number>;
  setDeathCnt: Setter<number>;

  mapGridSize: Accessor<{ width: string, height: string }>
  setMapGridSize: Setter<{ width: string, height: string }>

  blockSize:  Accessor<{ width: number, height: number }>
  setBlockSize: Setter<{ width: number, height: number }>

  constructor() {
    ([this.world, this.setWorld] = createStore<elementType[]>(
      Array(Size.world.col * Size.world.row).fill(0)
    )),
    ([this.startPos, this.setStartPos] = createStore<vector2D>({
      x: 0, y: 0,
    })),
    ([this.goalPos, this.setGoalPos] = createStore<vector2D>({
      x: 0, y: 0,
    })),
    ([this.player, this.setPlayer] = createStore<agent>({
      position: {x: 0, y: 0},
      velocity: {x: 0, y: 0}
    })),
    ([this.bombs, this.setBombs] = createStore<vector2D[]>([])),
    ([this.walls, this.setWalls] = createStore<vector2D[]>([])),
    ([this.enemies, this.setEnemies] = createStore<agent[]>([])),
    ([this.isSuccess, this.setIsSuccess] = createSignal<boolean>(false)),
    ([this.isJumping, this.setIsJumping] = createSignal<boolean>(false)),
    ([this.is3DMode, this.setIs3DMode] = createSignal<boolean>(false)),
    ([this.deathCnt, this.setDeathCnt] = createSignal<number>(0)),
    ([this.mapGridSize, this.setMapGridSize] = createSignal({ width: "100%", height: "100%" })),
    ([this.blockSize, this.setBlockSize] = createSignal({ width: 0, height: 0 }))
  }

  gravity = 0.01; // Gravity strength for 2D mode
  jumpStrength = 0.2; // Initial upward velocity
  speed = 0.1;
  enemySpeed = 0.1;
  pressedKeys: Record<string, boolean> = {}; // Track pressed keys
  animationFrameId: number = -1;
  keyMappings: Record<string, string> = {};

  updateMapGridSize = () => {
    // wrapper size
    const container = document.getElementById("play-container");
    if (container) {
      const width = Math.max(
        container.clientWidth,
        Size.space.s * 2 + Size.world.minBlock * Size.world.col
        //   padding       minimum block size     num of grid
      );
      const height = Math.max(
        container.clientHeight,
        Size.space.s * 2 + Size.world.minBlock * Size.world.row
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
    const wrapper = document.getElementById("play-wrapper");
    const blockSizeHeight = wrapper? wrapper.clientHeight / Size.world.row : 0;
    const blockSizeWidth = wrapper? wrapper.clientWidth / Size.world.col : 0;

    // relocate each blocks with resized ratio
    this.setBlockSize({ width: blockSizeWidth, height: blockSizeHeight});
  }

  loadMapById = async (id: number) => {
    const curMap = await requestSys.getMapById(id)
    await mainSys.setCurMap(curMap);
    gameplaySys.updateMapGridSize();
    this.initialize(curMap.config);
  }

  terminate = (isInPopup: boolean) => {
      if(isInPopup){
        workplaceSys.setShowPlayPopup(false); // Close the popup
        workplaceSys.setIsSaveEnabled(true); // Enable the Save button
      }
      
      this.setPlayer("velocity", {x: 0, y: 0});
      window.removeEventListener("keydown", this.handleKeyDown);
      window.removeEventListener("keyup", this.handleKeyUp);
  }

  initialize = (world: elementType[]) => {
    this.setIsSuccess(false);
    this.setIsJumping(false);
    this.setDeathCnt(0);
    this.setPlayer({
      position: {x: 0, y: 0},
      velocity: {x: 0, y: 0}
    })

    // fetch user's key set
    this.keyMappings = {
      keyRight: mainSys.curUser.keys[0],
      keyLeft:  mainSys.curUser.keys[1],
      keyDown:  mainSys.curUser.keys[2],
      keyUp:    mainSys.curUser.keys[3],
      key2:     mainSys.curUser.keys[4],
      key3:     mainSys.curUser.keys[5],
    };

    // initialize key handlers
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);

    // initialize world
    this.setWorld(world);
    this.setWalls([]);
    this.setEnemies([]);
    this.setBombs([]);

    this.world.forEach((block, index) => {
      const col = index % Size.world.col;
      const row = Math.floor(index / Size.world.col);

      // place pivot : left lower
      const blockPos: vector2D = {
        x: col,
        y: (Size.world.row - row - 1),
      };

      if (block === 2) {
        this.setStartPos(blockPos);
      } else if (block === 3) {
        this.setGoalPos(blockPos);
      } else if (block === 4) {
        this.setWalls((prev) => [...prev, blockPos]);
      } else if (block === 5) {
        this.setEnemies((prev) => [...prev, {
          position: {x: blockPos.x, y: blockPos.y},
          velocity: {x: this.enemySpeed, y: 0}
        }]);
      } else if (block === 6) {
        this.setBombs((prev) => [...prev, blockPos]);
      }
    });

    this.setPlayer("position", this.startPos);

    this.animationFrameId = requestAnimationFrame(this.updatePosition);

    return () => {
      window.removeEventListener("keydown", this.handleKeyDown);
      window.removeEventListener("keyup", this.handleKeyUp);
    };
  };

  // Jump logic for 2D mode
  jump = () => {
    if (!this.isJumping()) {
      this.setPlayer("velocity", "y", this.jumpStrength); // Set upward velocity (negative to move up)
      this.setIsJumping(true); // Prevent mid-air jumps
    }
  };

  // Handle key presses
  handleKeyDown = (e: KeyboardEvent) => {
    this.pressedKeys[e.key] = true;

    const { keyRight, keyLeft, keyDown, keyUp, key2, key3 } = this.keyMappings;

    if (e.key === key2 && this.is3DMode()) {
      this.setIs3DMode(false);
    } else if (e.key === key3 && !this.is3DMode()) {
      this.setIs3DMode(true);
    }

    // horizental move
    if (this.pressedKeys[keyLeft]) {
      this.setPlayer("velocity", "x", -this.speed);
    } else if (this.pressedKeys[keyRight]) {
      this.setPlayer("velocity", "x", this.speed);
    } else {
      this.setPlayer("velocity", "x", 0);
    }

    // vertical move
    if (this.is3DMode()) {
      // Stop vertical movement in 3D mode
      this.setPlayer("velocity", "y", 0);

      if (this.pressedKeys[keyUp]) {
        this.setPlayer("velocity", "y", this.speed);
      } else if (this.pressedKeys[keyDown]) {
        this.setPlayer("velocity", "y", -this.speed);
      }
    } else {
      if (this.pressedKeys[keyUp]) this.jump();
    }
  };

  handleKeyUp = (e: KeyboardEvent) => {
    this.pressedKeys[e.key] = false
    ;
    const { keyRight, keyLeft, keyDown, keyUp, key2, key3 } = this.keyMappings;

    // Update horizontal movement based on remaining pressed keys
    if (this.pressedKeys[keyLeft]) {
      this.setPlayer("velocity", "x", -this.speed);
    } else if (this.pressedKeys[keyRight]) {
      this.setPlayer("velocity", "x", this.speed);
    } else {
      this.setPlayer("velocity", "x", 0);
    }

    // Update vertical movement based on remaining pressed keys
    
    if (this.is3DMode()) {
      if (this.pressedKeys[keyDown]) {
        this.setPlayer("velocity", "y", -this.speed);
      } else if (this.pressedKeys[keyUp]) {
        this.setPlayer("velocity", "y", this.speed);
      } else {
        this.setPlayer("velocity", "y", 0);
      }
    }
  };

  // Collision detection
  checkCollision = (col1: vector2D, col2: vector2D) => {
    return (col1.x     < col2.x + 1 &&
            col1.x + 1 > col2.x     &&
            col1.y     < col2.y + 1 &&
            col1.y + 1 > col2.y
    )
  }

  checkCollisionDeath = (items: vector2D[]) => {
    const isCollide = items.map((block) => this.checkCollision(this.player.position, block))
                                .some(block => block)
    if (isCollide) {
      this.setDeathCnt(this.deathCnt() + 1);
      this.setPlayer("position", this.startPos);
    }
  };

  // Game loop to update position
  updatePosition = () => {

    /// player movement ///

    let updatedPos = {x: this.player.position.x, y: this.player.position.y}

    // update horizental move
    updatedPos.x = updatedPos.x + this.player.velocity.x;
    // wall collision check
    for (const wall of this.walls){
      if (this.checkCollision(updatedPos, wall)){
        updatedPos.x = wall.x - Math.sign(this.player.velocity.x);
      }
    }
    // bounding x ~ [0, Size.world.col - 1]
    const clippedX = Math.max(0, Math.min(updatedPos.x, Size.world.col - 1));
    if (updatedPos.x !== clippedX) {
      updatedPos.x = clippedX;
      this.setPlayer("velocity", "x", 0);
    }

    // update vertical move
    updatedPos.y = updatedPos.y + this.player.velocity.y;
    // wall collision check
    for (const wall of this.walls){
      if (this.checkCollision(updatedPos, wall)){
        updatedPos.y = wall.y - Math.sign(this.player.velocity.y);
        // Allow jumping again at the wall
        this.setIsJumping(this.player.velocity.y >= 0);
        this.setPlayer("velocity", "y", 0);
      }
    }
    // bounding y ~ [0, Size.world.row - 1]
    const clippedY = Math.max(0, Math.min(updatedPos.y, Size.world.row - 1));
    if (updatedPos.y !== clippedY) {
      updatedPos.y = clippedY;
      // Allow jumping again at the floor
      this.setIsJumping(updatedPos.y !== 0);
      this.setPlayer("velocity", "y", 0);
    }

    this.setPlayer("position", updatedPos);

    // Apply gravity
    if (!this.is3DMode()) {
      this.setPlayer("velocity", "y", (vY) => vY - this.gravity);
    }

    // Check collision
    this.setIsSuccess(this.checkCollision(this.player.position, this.goalPos));
    this.checkCollisionDeath(this.bombs);
    this.checkCollisionDeath(this.enemies.map((enemy) => enemy.position));

    /// enemies movement ///

    this.enemies.forEach((enemy, index) => {
      // 2D mode : keep moving horizentally
      if (!this.is3DMode()) {
        let updatedPos = {x: enemy.position.x, y: enemy.position.y}

        // update horizental move
        updatedPos.x = updatedPos.x + enemy.velocity.x;
        // wall collision check
        for (const obs of [...this.walls, ...this.bombs]){
          if (this.checkCollision(updatedPos, obs)){
            updatedPos.x = obs.x - Math.sign(enemy.velocity.x);
            // Reverse direction if hits borders
            this.setEnemies(index, "velocity", "x", (dir) => -dir);
          }
        }
        // bounding x ~ [0, Size.world.col - 1]
        const clippedX = Math.max(0, Math.min(enemy.position.x, Size.world.col - 1));
        if (enemy.position.x !== clippedX) {
          updatedPos.x = clippedX;
          // Reverse direction if hits borders
          this.setEnemies(index, "velocity", "x", (dir) => -dir);
        }

        // update vertical move (falling)
        updatedPos.y = updatedPos.y + enemy.velocity.y;
        // wall collision check
        for (const obs of [...this.walls, ...this.bombs]){
          if (this.checkCollision(updatedPos, obs)){
            updatedPos.y = obs.y - Math.sign(enemy.velocity.y);
            this.setEnemies(index, "velocity", "y", 0);
          }
        }
        // bounding y ~ [0, Size.world.row - 1]
        const clippedY = Math.max(0, Math.min(enemy.position.y, Size.world.row - 1));
        if (enemy.position.y !== clippedY) {
          updatedPos.y = clippedY;
          this.setEnemies(index, "velocity", "y", 0);
        }

        this.setEnemies(index, "position", updatedPos);

        // Apply gravity
        if (!this.is3DMode()) {
          this.setEnemies(index, "velocity", "y", (vY) => vY - this.gravity);
        }
      }
      // 3D mode : Stop and trace player only if it gets close
      else {
        let updatedPos = {x: enemy.position.x, y: enemy.position.y}

        // get distance
        const dx = this.player.position.x - enemy.position.x;
        const dy = this.player.position.y - enemy.position.y;
        const magnitude = Math.sqrt(dx ** 2 + dy ** 2);

        if (magnitude < 3) {
          // Move towards the character
          const towardDirection: vector2D = {
            x: dx / magnitude,
            y: dy / magnitude,
          }

          this.setEnemies(index, "velocity", {
            x: towardDirection.x * this.enemySpeed,
            y: towardDirection.y * this.enemySpeed,
          });
          
          // update horizental move
          updatedPos.x = updatedPos.x + enemy.velocity.x;
          // wall collision check
          for (const obs of [...this.walls, ...this.bombs]){
            if (this.checkCollision(updatedPos, obs)){
              updatedPos.x = obs.x - Math.sign(enemy.velocity.x);
              this.setEnemies(index, "velocity", "x", 0);
            }
          }
          // bounding x ~ [0, Size.world.col - 1]
          const clippedX = Math.max(0, Math.min(enemy.position.x, Size.world.col - 1));
          if (enemy.position.x !== clippedX) {
            updatedPos.x = clippedX;
            this.setEnemies(index, "velocity", "x", 0);
          }

          // update vertical move
          updatedPos.y = updatedPos.y + enemy.velocity.y;
          // wall collision check
          for (const obs of [...this.walls, ...this.bombs]){
            if (this.checkCollision(updatedPos, obs)){
              updatedPos.y = obs.y - Math.sign(enemy.velocity.y);
              this.setEnemies(index, "velocity", "y", 0);
            }
          }
          // bounding y ~ [0, Size.world.row - 1]
          const clippedY = Math.max(0, Math.min(enemy.position.y, Size.world.row - 1));
          if (enemy.position.y !== clippedY) {
            updatedPos.y = clippedY;
            this.setEnemies(index, "velocity", "y", 0);
          }

          this.setEnemies(index, "position", updatedPos);
        }
      }
    });

    if (this.animationFrameId !== 0) {
      this.animationFrameId = requestAnimationFrame(this.updatePosition);
    } // Loop the update
  };
}

export const gameplaySys = new GameplaySys();
