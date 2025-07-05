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

    this.activeScene = null;

    this.socket = null;
    this.isLoading = false;

    this.roomCode = null;
    this.playerId = null;
    this.isHost = false;
    this.roomPlayers = [];
  }

  init() {
    this.switchScene("mainMenu");
  }

  reset() {
    this.roomCode = null;
    this.playerId = null;
    this.isHost = false;
    this.roomPlayers = [];
  }

  switchScene = (name) => {
    this.activeScene?.destroy();

    let scene;

    switch (name) {
      case "mainMenu":
        scene = new MainMenu(this);
        break;

      case "game":
        scene = new GameScene(this);
        break;

      case "lobby":
        scene = new Lobby(this);
        break;

      default:
        throw new Error("Scene not found.");
    }

    this.activeScene = scene;
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

            if (data.playerId) {
              this.playerId = data.playerId;
            }

            if (data.isHost) {
              this.isHost = true;
            }

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

        case "room-update":
          if (data.players) {
            this.roomPlayers = data.players;
          }
          break;

        case "game-started":
          if (data.success) {
            if (data.players) {
              this.roomPlayers = data.players;
            }

            this.switchScene("game");
          } else {
            if (data.error) {
              alert(data.error);
            }
          }
          break;

        case "player-moved":
          if (this.activeScene?.players && data.id && data.position) {
            const updatedPlayer = this.activeScene.players.find(
              (p) => p.id === data.id
            );
            if (updatedPlayer && !updatedPlayer.isSelf) {
              updatedPlayer.targetPosition = data.position;
            }
          }
          break;

        case "player-left":
          if (data.id) {
            this.roomPlayers = this.roomPlayers.filter((p) => p.id !== data.id);

            if (this.activeScene?.players) {
              const activeScene = this.activeScene;
              const leavingPlayer = activeScene.players.find(
                (p) => p.id === data.id
              );

              if (leavingPlayer) {
                leavingPlayer.destroy();
              }

              activeScene.players = activeScene.players.filter(
                (p) => p.id !== data.id
              );
            }
          }
          break;

        case "player-fired":
          if (this.activeScene?.players && data.id) {
            const firingPlayer = this.activeScene.players.find(
              (p) => p.id === data.id
            );

            if (data.isFiring) {
              firingPlayer.startFire();
            } else {
              firingPlayer.stopFire();
            }
          }
          break;

        default:
          console.warn("Unhandled message type: ", data);
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
