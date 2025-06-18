import { GameObject } from "./GameObject.js";

export class Scene extends GameObject {
  constructor({ bounds }) {
    super({});

    this.bounds = bounds;
  }

  attach(name, object) {
    if (this[name] !== undefined)
      throw new Error("Object already attached to scene: " + name);

    this[name] = object;
  }
}
