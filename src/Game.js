import { Button } from "./Button.js";
import { GameLoop } from "./GameLoop.js";
import { Input } from "./Input.js";
import { Player } from "./Player.js";
import { Scene } from "./Scene.js";
import { Vector2 } from "./Vector2.js";

export class Game {
  constructor(canvas, virtualWidth, virtualHeight) {
    if (!canvas) throw new Error("Canvas not found.");
    this.canvas = canvas;

    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = virtualWidth * dpr;
    this.canvas.height = virtualHeight * dpr;
    this.ctx = canvas.getContext("2d");
    this.ctx.scale(dpr, dpr);

    this.gameWidth = virtualWidth;
    this.gameHeight = virtualHeight;

    this.gameBounds = { width: this.gameWidth, height: this.gameHeight };
    this.input = new Input(this.canvas, dpr);

    this.activeScene = null;
  }

  init() {
    // initiate main menu scene
    const mainMenuScene = new Scene({ bounds: this.gameBounds });
    const hostButton = new Button({
      text: "Host Game",
      position: new Vector2(20, 20),
      input: this.input,
      context: this.ctx,
      onClick: (e) => console.log("clicked"),
    });
    const joinButton = new Button({
      text: "Join Game",
      position: new Vector2(20, 50),
      input: this.input,
      context: this.ctx,
      onClick: (e) => console.log("clicked"),
    });

    mainMenuScene.addChild(hostButton);
    mainMenuScene.addChild(joinButton);

    // initiate gameplay scene
    const gameScene = new Scene({ bounds: this.gameBounds });
    const player = new Player({ input: this.input });

    // add elements to gamescene
    gameScene.addChild(player);

    // this.activeScene = gameScene;
    this.activeScene = mainMenuScene;
  }

  update = (delta) => {
    this.activeScene.stepEntry(delta, this.activeScene);
  };

  render = () => {
    this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
    this.activeScene.draw(this.ctx, 0, 0);
  };

  start() {
    const gameLoop = new GameLoop(this.update, this.render);
    gameLoop.start();
  }
}
