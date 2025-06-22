import { Interface } from "./Interface.js";
import { Vector2 } from "./Vector2.js";

export class Button extends Interface {
  constructor({
    padding = new Vector2(4, 4),
    textAlign = "center",
    backgroundColor = "white",
    onClick,
    ...options
  }) {
    super({ backgroundColor, padding, textAlign, ...options });

    this.onClick = onClick;
  }
}
