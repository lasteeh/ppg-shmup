import { GameObject } from "./GameObject.js";
import { Vector2 } from "./Vector2.js";

export class Button extends GameObject {
  constructor({
    text,
    width = null,
    height = null,
    fontSize = 14,
    backgroundColor = "white",
    textColor = "black",
    position,
    onClick,
  }) {
    super({ position });

    this.onClick = onClick;

    this.text = text;
    this.fontSize = fontSize;
    this.backgroundColor = backgroundColor;
    this.textColor = textColor;
    this.width = width;
    this.height = height;
    this.padding = new Vector2(4, 4);
  }

  setProperty(property, value) {
    if (!this.hasOwnProperty(property))
      throw new Error("Property not found: " + property);

    this[property] = value;
  }

  step(delta, root) {
    const { input } = root;

    if (this.isHovered(input)) {
      this.backgroundColor = "lightgray";
      if (input?.wasClicked()) {
        this.onClick();
        input?.resetClick();
      }
    } else {
      this.backgroundColor = "white";
    }
  }

  isHovered(input) {
    return (
      input?.mouse.x >= this.position.x &&
      input?.mouse.x <= this.position.x + this.width &&
      input?.mouse.y >= this.position.y &&
      input?.mouse.y <= this.position.y + this.height
    );
  }

  drawImage(ctx, x, y) {
    let drawX = Math.round(x);
    let drawY = Math.round(y);

    ctx.font = `${this.fontSize}px sans-serif`;
    this.textWidth = ctx.measureText(this.text).width;
    this.textHeight = this.fontSize;

    const calculatedWidth = this.textWidth + this.padding.x * 2;
    const calculatedHeight = this.textHeight + this.padding.y * 2;

    this.width =
      this.width !== null
        ? Math.max(this.width, calculatedWidth)
        : calculatedWidth;
    this.height =
      this.height !== null
        ? Math.max(this.height, calculatedHeight)
        : calculatedHeight;

    const textX = drawX + (this.width - this.textWidth) / 2;
    const textY = drawY + (this.height + this.fontSize / 2) / 2;

    // draw backround
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(drawX, drawY, this.width, this.height);

    // draw text
    ctx.fillStyle = this.textColor;
    ctx.fillText(this.text, Math.round(textX), Math.round(textY));
  }
}
