import { Player } from "../../components/Player.js";
import { Scene } from "../../components/Scene.js";

export class GameScene extends Scene {
  constructor(game) {
    super({});
    if (!game) throw new Error("Game not found.");

    this.game = game;
    this.attach("bounds", game.gameBounds);
    this.attach("input", game.input);

    this.players = [];
    this.player = null;
  }

  init() {
    const game = this.game;

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
    }
  }
}
