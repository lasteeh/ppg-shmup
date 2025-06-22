import { Interface } from "./Interface.js";
import { Vector2 } from "./Vector2.js";

export class Button extends Interface {
  constructor({
    padding = new Vector2(4, 4),
    textAlign = "center",
    backgroundColor = "white",
    hoverBackgroundColor = "lightgray",
    onClick,
    onHover,
    onHoverStart,
    onHoverEnd,
    ...options
  }) {
    super({
      backgroundColor,
      hoverBackgroundColor,
      padding,
      textAlign,
      ...options,
    });

    this.onClick = onClick;
    this.onHover = onHover;
    this.onHoverStart = onHoverStart;
    this.onHoverEnd = onHoverEnd;
  }
}
