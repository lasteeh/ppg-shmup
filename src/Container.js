import { GameObject } from "./GameObject.js";

export class Container extends GameObject {
  constructor({
    position,
    width = null,
    height = null,
    backgroundColor = "white",
  }) {
    super({ position });

    this.width = width;
    this.height = height;
    this.backgroundColor = backgroundColor;
  }
}
