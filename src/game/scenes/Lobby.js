import { Button } from "../../components/Button.js";
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

    this.addChild(this.roomCodeLabel);
    this.addChild(this.goBackButton);
  }
}
