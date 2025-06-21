import { Interactable } from "./Interactable.js";
import { Vector2 } from "./Vector2.js";

export class Button extends Interactable {
  constructor({
    padding = new Vector2(4, 4),
    textAlign = "center",
    onClick,
    ...options
  }) {
    super({ padding, textAlign, ...options });

    this.onClick = onClick;
  }

  step(delta, root) {
    const { input } = root;

    if (this.isHovered(input)) {
      this.backgroundColor = "lightgray";
      if (input?.wasClicked()) {
        if (!this.onClick) return;
        this.onClick();
        input?.resetClick();
      }
    } else {
      this.backgroundColor = "white";
    }
  }

  isHovered(input) {
    const globalX = (this.parent?.position?.x ?? 0) + this.position.x;
    const globalY = (this.parent?.position?.y ?? 0) + this.position.y;

    return (
      input?.mouse.x >= globalX &&
      input?.mouse.x <= globalX + this.drawWidth &&
      input?.mouse.y >= globalY &&
      input?.mouse.y <= globalY + this.drawHeight
    );
  }
}
