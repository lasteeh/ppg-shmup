import { GameObject } from "./GameObject.js";

export class Scene extends GameObject {
  constructor({ bounds, input }) {
    super({});

    this.bounds = bounds;
    this.input = input;
  }
}
