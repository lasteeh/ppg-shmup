import { Button } from "../../components/Button.js";
import { Label } from "../../components/Label.js";
import { Container } from "../../components/Container.js";
import { Scene } from "../../components/Scene.js";
import { copyTextToClipboard } from "../../helpers.js";
import { Vector2 } from "../../Vector2.js";

export class Lobby extends Scene {
  constructor(game) {
    super({});
    if (!game) throw new Error("Game not found.");

    this.game = game;
    this.attach("input", game.input);

    this.roomCodeLabel = null;

    this.goBackButton = null;
    this.startButton = null;

    this.playersBox = null;

    this.lastPlayerIds = [];
    this.currentPlayers = [];
  }

  init() {
    const game = this.game;

    this.roomCodeLabel = new Button({
      text: `Room Code: ${game.roomCode ?? ""}`,
      position: new Vector2(20, 20),
      fontSize: 20,
      onClick: async () => {
        if (!game.roomCode) return;

        try {
          await copyTextToClipboard(game.roomCode);
        } catch (err) {
          console.error("Failed to copy room code: ", err);
        }
      },
    });

    this.goBackButton = new Button({
      text: "Go Back",
      position: new Vector2(20, game.gameHeight - 40),
      onClick: () => {
        game.socket?.close();
        game.switchScene("mainMenu");
      },
    });

    this.startButton = new Button({
      text: "Start Game",
      position: new Vector2(20, game.gameHeight - 70),
      onClick: async () => {
        if (game.isLoading) return;

        game.load(true);

        try {
          const message = JSON.stringify({ type: "start-game" });
          const socket = await game.connectSocket();

          if (socket && socket.readyState == WebSocket.OPEN) {
            // submit room code here
            socket.send(message);
          }
        } catch (err) {
          alert(err);
          game.load(false);
        }
      },
    });

    this.addChild(this.roomCodeLabel);
    this.addChild(this.goBackButton);

    if (game.isHost) {
      this.addChild(this.startButton);
    }

    this.playersBox = new Container({
      flexDirection: "column",
      gap: 10,
      position: new Vector2(250, 20),
    });

    this.addChild(this.playersBox);
  }

  step(delta, root) {
    const game = this.game;
    const newPlayerIds = game.roomPlayers.map((p) => p.id);

    // compare arrays by converting to string
    const playersChanged =
      JSON.stringify(newPlayerIds) !== JSON.stringify(this.lastPlayerIds);

    if (playersChanged) {
      // Update cache
      this.lastPlayerIds = newPlayerIds;

      // remove old UI labels
      for (const playerLabel of this.currentPlayers) {
        this.playersBox.removeChild(playerLabel);
      }

      this.currentPlayers = [];

      for (const player of game.roomPlayers) {
        const info = new Label({
          text: player.name,
          fontSize: 20,
          backgroundColor: "yellow",
          padding: new Vector2(10, 10),
        });

        this.playersBox.addChild(info);
        this.currentPlayers.push(info);
      }
    }
  }
}
