import { Player } from "../../components/Player.js";
import { Scene } from "../../components/Scene.js";

export class GameScene extends Scene {
  constructor(game) {
    super({});
    if (!game) throw new Error("Game not found.");

    this.game = game;
    this.attach("bounds", game.gameBounds);
    this.attach("input", game.input);

    this.player = null;
  }

  init() {
    const game = this.game;

    this.player = new Player({});
    this.addChild(this.player);
  }
}
