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

    this.currentPlayers = [];
  }

  init() {
    const game = this.game;

    this.roomCodeLabel = new Button({
      text: `Room Code: ${game.roomCode ?? ""}`,
      position: new Vector2(20, 20),
      fontSize: 20,
      onClick: () => {
        if (!game.roomCode) return;
        copyTextToClipboard(game.roomCode);
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
      onClick: () => {
        console.log("starting");
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

    // console.log(game.roomPlayers);
    for (const player of this.currentPlayers) {
      this.playersBox.removeChild(player);
    }
    this.currentPlayers = game.roomPlayers;

    for (const player of this.currentPlayers) {
      const info = new Label({
        text: player.name,
        fontSize: 20,
        backgroundColor: "yellow",
        padding: new Vector2(10, 10),
      });

      this.currentPlayers.push(info);
      this.playersBox.addChild(info);
    }
  }
}
