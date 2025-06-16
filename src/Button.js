import { GameObject } from "./GameObject.js";
import { Vector2 } from "./Vector2.js";

export class Button extends GameObject {
  constructor({
    text,
    width = null,
    height = null,
    position,
    input,
    onClick,
    context,
  }) {
    super({ position });

    this.input = input;
    this.onClick = onClick;

    this.text = text;
    this.fontSize = 14;
    this.backgroundColor = "white";
    this.textColor = "black";
    this.padding = new Vector2(4, 4);

    context.font = `${this.fontSize}px sans-serif`;
    this.textWidth = context.measureText(this.text).width;
    this.textHeight = this.fontSize;

    const calculatedWidth = this.textWidth + this.padding.x * 2;
    const calculatedHeight = this.textHeight + this.padding.y * 2;

    this.width =
      width !== null ? Math.max(width, calculatedWidth) : calculatedWidth;
    this.height =
      height !== null ? Math.max(height, calculatedHeight) : calculatedHeight;
  }

  step(delta, root) {
    if (this.isHovered()) {
      this.backgroundColor = "lightgray";
      if (this.input?.wasClicked()) {
        this.onClick();
        this.input?.resetClick();
      }
    } else {
      this.backgroundColor = "white";
    }
  }

  isHovered() {
    return (
      this.input?.mouse.x >= this.position.x &&
      this.input?.mouse.x <= this.position.x + this.width &&
      this.input?.mouse.y >= this.position.y &&
      this.input?.mouse.y <= this.position.y + this.height
    );
  }

  drawImage(ctx, x, y) {
    let drawX = Math.round(x);
    let drawY = Math.round(y);

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
