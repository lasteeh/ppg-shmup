import { Button } from "./Button.js";
import { GameLoop } from "./GameLoop.js";
import { Input } from "./Input.js";
import { Label } from "./Label.js";
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
  }

  init() {
    // initiate main menu scene
    const mainMenuScene = new Scene();
    mainMenuScene.attach("input", this.input);
    const hostButton = new Button({
      text: "Host Game",
      width: 120,
      position: new Vector2(20, 20),
      onClick: async () => {
        if (this.isLoading) return;

        this.load(true);
        hostButton.setProperty("text", "Creating a lobby...");

        try {
          const socket = await this.connectSocket();

          if (socket && socket.readyState == WebSocket.OPEN) {
            const lobbyScene = this.scenes["lobby"];
            lobbyScene.attach(socket);

            this.load(false);
            this.switchScene("lobby");
          }
        } catch (err) {
          hostButton.setProperty("text", "Host Game");
          alert("Failed to connect to websocket server. Try again later.");
        } finally {
          this.load(false);
        }
      },
    });
    const joinButton = new Button({
      text: "Join Game",
      width: 120,
      position: new Vector2(20, 50),
      onClick: async () => {
        if (this.isLoading) return;

        this.load(true);
        joinButton.setProperty("text", "Joining a lobby...");

        try {
          const socket = await this.connectSocket();

          if (socket && socket.readyState == WebSocket.OPEN) {
            const lobbyScene = this.scenes["lobby"];
            lobbyScene.attach(socket);

            this.load(false);
            this.switchScene("lobby");
          }
        } catch (err) {
          joinButton.setProperty("text", "Join Game");
          alert("Failed to connect to websocket server. Try again later.");
        } finally {
          this.load(false);
        }
      },
    });

    // add elements to main menu scene
    mainMenuScene.addChild(hostButton);
    mainMenuScene.addChild(joinButton);

    this.scenes["mainMenu"] = mainMenuScene;

    // initiate gameplay scene
    const gameScene = new Scene();
    gameScene.attach("bounds", this.gameBounds);
    gameScene.attach("input", this.input);
    const player = new Player({});

    // add elements to gamescene
    gameScene.addChild(player);

    this.scenes["game"] = gameScene;

    const lobbyScene = new Scene();
    lobbyScene.attach("input", this.input);
    const roomCode = new Label({
      text: "Room Code: ",
      position: new Vector2(20, 20),
    });
    const goBackButton = new Button({
      text: "Go Back",
      position: new Vector2(20, this.gameHeight - 40),
      onClick: () => {
        this.socket.close();
        this.switchScene("mainMenu");
      },
    });

    lobbyScene.addChild(roomCode);
    lobbyScene.addChild(goBackButton);

    this.scenes["lobby"] = lobbyScene;

    this.switchScene("mainMenu");
  }

  switchScene = (name) => {
    if (!this.scenes[name]) throw new Error("Scene not found.");
    this.activeScene = this.scenes[name];
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
        console.log("Websocket closed.");
        this.socket.removeEventListener("message", this.handleSocketMessage);
        this.socket = null;
      };
    });
  };

  handleSocketMessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "room-created":
          // check if code received
          break;
        default:
          console.warn("Unhandled message type: ", data.type);
      }
    } catch (err) {
      console.error("Failed to handle message: ", err);
    }
  };

  load = (bool) => {
    this.isLoading = bool;
    document.body.setAttribute("data-loading", bool);
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
