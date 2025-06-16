import { GameObject } from "./GameObject.js";
import { Vector2 } from "./Vector2.js";

export class Button extends GameObject {
  constructor({ text, position, input, onClick, context }) {
    super({ position });

    this.input = input;
    this.onClick = onClick;

    this.text = text;
    this.width = null;
    this.height = null;
    this.fontSize = 14;
    this.backgroundColor = "white";
    this.textColor = "black";
    this.padding = new Vector2(4, 4);

    context.font = `${this.fontSize}px sans-serif`;
    this.textMetrics = context.measureText(this.text);
    this.textWidth = this.textMetrics.width;
    this.textHeight = this.fontSize;

    if (this.width === null) this.width = this.textWidth + this.padding.x * 2;
    if (this.height === null)
      this.height = this.textHeight + this.padding.y * 2;
  }

  step(delta, root) {
    if (this.isHovered()) {
      if (this.input?.wasClicked()) {
        this.onClick();
        this.input?.resetClick();
      }
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
