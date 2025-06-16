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

    this.scenes = {};
    this.activeScene = null;

    this.socket = null;
  }

  init() {
    // initiate main menu scene
    const mainMenuScene = new Scene({ bounds: this.gameBounds });
    const hostButton = new Button({
      text: "Host Game",
      position: new Vector2(20, 20),
      input: this.input,
      context: this.ctx,
      onClick: (e) => this.connectSocket(),
    });
    const joinButton = new Button({
      text: "Join Game",
      position: new Vector2(20, 50),
      input: this.input,
      context: this.ctx,
      onClick: (e) => console.log("clicked"),
    });

    // add elements to main menu scene
    mainMenuScene.addChild(hostButton);
    mainMenuScene.addChild(joinButton);

    this.scenes["mainMenu"] = mainMenuScene;

    // initiate gameplay scene
    const gameScene = new Scene({ bounds: this.gameBounds });
    const player = new Player({ input: this.input });

    // add elements to gamescene
    gameScene.addChild(player);

    this.scenes["game"] = gameScene;

    this.switchScene("mainMenu");
  }

  switchScene(name) {
    if (!this.scenes[name]) throw new Error("Scene not found.");
    this.activeScene = this.scenes[name];
  }

  connectSocket() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN)
      return this.socket;

    this.socket = new WebSocket("ws://localhost:7979/ws");

    this.socket.onopen = () => {
      console.log("Connected to websocket server.");
    };

    this.socket.onerror = (e) => {
      console.log("Websocket error: ", e);
    };

    this.socket.onclose = () => {
      console.log("Websocket closed.");
      this.socket = null;
    };

    return this.socket;
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
