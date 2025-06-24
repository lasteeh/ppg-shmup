import { GameLoop } from "./GameLoop.js";
import { Input } from "./Input.js";
import { MainMenu } from "./game/scenes/MainMenu.js";
import { GameScene } from "./game/scenes/GameScene.js";
import { Lobby } from "./game/scenes/Lobby.js";

export class Game {
  constructor(canvas, virtualWidth, virtualHeight) {
    if (!canvas) throw new Error("Canvas not found.");
    this.canvas = canvas;

    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = virtualWidth * dpr;
    this.canvas.height = virtualHeight * dpr;

    this.aspectRatio = virtualWidth / virtualHeight;
    this.canvas.style.aspectRatio = this.aspectRatio;

    this.ctx = canvas.getContext("2d");
    this.ctx.scale(dpr, dpr);

    this.gameWidth = virtualWidth;
    this.gameHeight = virtualHeight;

    this.gameBounds = { width: this.gameWidth, height: this.gameHeight };
    this.input = new Input(this.canvas, dpr);

    this.scenes = {};
    this.activeScene = null;

    this.socket = null;
    this.isLoading = false;

    this.roomCode = null;
    this.isHost = false;
  }

  init() {
    // initiate main menu scene
    const mainMenuScene = new MainMenu(this);
    this.registerScene("mainMenu", mainMenuScene);

    // initiate gameplay scene
    const gameScene = new GameScene(this);
    this.registerScene("game", gameScene);

    const lobbyScene = new Lobby(this);
    this.registerScene("lobby", lobbyScene);

    this.switchScene("mainMenu");
  }

  registerScene(name, scene) {
    this.scenes[name] = scene;
  }

  getScene(name) {
    return this.scenes[name];
  }

  switchScene = (name) => {
    if (!this.scenes[name]) throw new Error("Scene not found.");
    this.activeScene = this.scenes[name];
    this.activeScene.init();
  };

  connectSocket = () => {
    return new Promise((resolve, reject) => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        resolve(this.socket);
        return;
      }

      this.socket = new WebSocket("ws://localhost:7979/ws");

      this.socket.onopen = () => {
        console.log("Connected to websocket server.");
        this.socket.addEventListener("message", this.handleSocketMessage);
        resolve(this.socket);
      };

      this.socket.onerror = (e) => {
        console.log("Websocket error: ", e);
        reject(new Error("Failed to connect to websocket server."));
      };

      this.socket.onclose = () => {
        alert("Disconnected to server.");
        this.socket.removeEventListener("message", this.handleSocketMessage);
        this.socket = null;

        this.switchScene("mainMenu");
        if (this.isLoading) this.load(false);
      };
    });
  };

  handleSocketMessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "room-joined":
          if (data.success) {
            if (data.code) {
              this.roomCode = data.code;
            }

            if (data.isHost) {
              this.isHost = true;
            }
            console.log(this.roomCode, this.isHost);
            this.switchScene("lobby");
          } else {
            if (data.error) {
              alert(data.error);
            }
          }
          break;
        case "room-created":
          // check if code received
          if (data.code) {
            this.roomCode = data.code;
            console.log("Room created: ", data.code);
          }
          break;
        default:
          console.warn("Unhandled message type: ", data.type);
      }
    } catch (err) {
      console.error("Failed to handle message: ", err);
    }

    if (this.isLoading) {
      this.load(false);
    }
  };

  load = (bool) => {
    this.isLoading = bool;
    document.documentElement.setAttribute("data-loading", bool);
  };

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
