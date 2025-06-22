import { GameObject } from "./GameObject.js";
import { Vector2 } from "./Vector2.js";

export class Interface extends GameObject {
  constructor({
    position,
    zIndex,
    text = "",
    textColor = "black",
    textAlign = "left", // "center", "left", "right"
    verticalAlign = "middle", // "top", "middle", "bottom",
    fontSize = 14,
    fontFamily = "sans-serif",
    backgroundColor = "transparent",
    hoverBackgroundColor = null,
    width = null,
    height = null,
    padding = new Vector2(0, 0),
  }) {
    super({ position, zIndex });

    this.drawWidth = 0;
    this.drawHeight = 0;

    this.text = text;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.backgroundColor = backgroundColor;
    this.hoverBackgroundColor = hoverBackgroundColor ?? this.backgroundColor;
    this.textColor = textColor;
    this.textAlign = textAlign;
    this.verticalAlign = verticalAlign;
    this.width = width;
    this.height = height;
    this.padding = padding;
    this.isHovering = false;

    this._lastFont = null; // for caching font
  }

  containsPoint(x, y) {
    const absX = (this.parent?.position.x ?? 0) + this.position.x;
    const absY = (this.parent?.position.y ?? 0) + this.position.y;
    return (
      x >= absX &&
      x <= absX + this.drawWidth &&
      y >= absY &&
      y <= absY + this.drawHeight
    );
  }

  onClick() {
    //
  }

  onHover() {
    //
  }
  onHoverStart() {
    //
  }
  onHoverEnd() {
    //
  }

  computeTextMetrics(ctx, x, y) {
    const { fontSize, fontFamily, text, padding, width, height, textAlign } =
      this;

    if (this._lastFont !== `${fontSize}px ${fontFamily}`) {
      this._lastFont = `${fontSize}px ${fontFamily}`;
      ctx.font = this._lastFont;
    }
    const textWidth = ctx.measureText(text).width;
    const textHeight = textWidth > 0 ? fontSize : 0;

    const padX = padding.x * 2;
    const padY = padding.y * 2;

    const paddedTextWidth = textWidth + padX;
    const paddedTextHeight = textHeight + padY;

    const naturalWidth = (width ?? 0) + padX;
    const naturalHeight = (height ?? 0) + padY;

    this.textWidth = textWidth;
    this.textHeight = textHeight;

    this.drawWidth =
      width != null ? width : Math.max(paddedTextWidth, naturalWidth);

    this.drawHeight =
      height != null ? height : Math.max(paddedTextHeight, naturalHeight);

    let textPosX = x + padding.x;
    let textPosY = y + padding.y + textHeight;

    switch (textAlign) {
      case "center":
        textPosX = x + (this.drawWidth - textWidth) / 2;
        break;
      case "right":
        textPosX = x + (this.drawWidth - textWidth - padding.x);
        break;
    }

    switch (this.verticalAlign) {
      case "middle":
        textPosY = y + (this.drawHeight + textHeight) / 2;
        break;
      case "bottom":
        textPosY = y + (this.drawHeight - padding.y);
        break;
    }

    this.textPositionX = textPosX;
    this.textPositionY = textPosY;
  }

  drawBackground(ctx, x, y) {
    ctx.fillStyle = this.isHovering
      ? this.hoverBackgroundColor
      : this.backgroundColor;
    ctx.fillRect(Math.round(x), Math.round(y), this.drawWidth, this.drawHeight);
  }

  drawText(ctx) {
    ctx.fillStyle = this.textColor;
    ctx.fillText(this.text, this.textPositionX, this.textPositionY);
  }

  draw(ctx, x, y) {
    let drawPosX = this.position.x;
    let drawPosY = this.position.y;

    if (this.parent && this.parent.position) {
      drawPosX = this.parent.position.x + this.position.x;
      drawPosY = this.parent.position.y + this.position.y;
    }

    if (this._dirty) {
      this.computeTextMetrics(ctx, drawPosX, drawPosY);
      this._dirty = false;
    }

    this.drawImage(ctx, drawPosX, drawPosY);

    this.children
      .slice()
      .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
      .forEach((child) => child.draw(ctx, drawPosX, drawPosY));
  }

  drawImage(ctx, x, y) {
    this.drawBackground(ctx, x, y);
    this.drawText(ctx);
  }
}
