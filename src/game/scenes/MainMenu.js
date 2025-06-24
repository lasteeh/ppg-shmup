import { Scene } from "../../components/Scene.js";

export class MainMenu extends Scene {
  constructor({ game }) {
    super({});
    if (!game) throw new Error("Game not found.");

    this.game = game;
  }
}
