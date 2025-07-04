import { Button } from "../../components/Button.js";
import { Player } from "../../components/Player.js";
import { Scene } from "../../components/Scene.js";
import { Vector2 } from "../../Vector2.js";

export class GameScene extends Scene {
  constructor(game) {
    super({});
    if (!game) throw new Error("Game not found.");

    this.game = game;
    this.attach("bounds", game.gameBounds);
    this.attach("input", game.input);

    this.players = [];
    this.player = null;

    this.leaveGameButton = null;
  }

  init() {
    const game = this.game;

    this.leaveGameButton = new Button({
      text: "Leave Game",
      position: new Vector2(game.gameWidth - 100, 20),
      onClick: async () => {
        game.socket?.close();
        game.switchScene("mainMenu");
      },
    });

    for (const playerData of game.roomPlayers) {
      const isSelf = playerData.id === game.playerId;

      const player = new Player({
        id: playerData.id,
        name: playerData.name,
        position: playerData.spawnPoint,
        isSelf: isSelf,
      });

      this.players.push(player);
      this.addChild(player);

      if (isSelf) this.player = player;

      this.addChild(this.leaveGameButton);
    }
  }
}
