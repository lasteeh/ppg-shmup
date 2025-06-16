import { GameObject } from "./GameObject.js";
import { Vector2 } from "./Vector2.js";

export class Label extends GameObject {
  constructor({ text, width = null, height = null, position }) {
    super({ position });

    this.text = text;
    this.fontSize = 14;
    this.backgroundColor = "white";
    this.textColor = "black";
    this.width = width;
    this.height = height;
    this.padding = new Vector2(4, 4);
  }

  step(delta, root) {
    //
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
