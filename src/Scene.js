import { GameObject } from "./GameObject.js";

export class Scene extends GameObject {
  constructor({ bounds }) {
    super({});

    this.bounds = bounds;
  }
}
