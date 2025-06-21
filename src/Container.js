import { UIElement } from "./UIElement.js";
export class Container extends UIElement {
  constructor({
    flexDirection = "row", // "row" or "column"
    gap = 0, // px between children
    ...options
  }) {
    super({ ...options });
    this.display = "flex";
    this.flexDirection = flexDirection;
    this.gap = gap;
  }

  computeChildrenLayout(ctx, parentX, parentY) {
    // Start offset at padding
    const isRow = this.flexDirection === "row";
    let offset = isRow ? this.padding.x : this.padding.y;

    this.children.forEach((child) => {
      // measure child at prospective pos
      const childX = parentX + (isRow ? offset : this.padding.x);
      const childY = parentY + (isRow ? this.padding.y : offset);
      child.computeTextMetrics(ctx, childX, childY);

      // set child relative position
      child.position.x = isRow ? offset : this.padding.x;
      child.position.y = isRow ? this.padding.y : offset;

      // advance offset by child size + gap
      offset += (isRow ? child.drawWidth : child.drawHeight) + this.gap;
    });

    // Auto-size container if unset
    if (this.width == null) {
      if (isRow) this.drawWidth = offset - this.gap + this.padding.x;
      else
        this.drawWidth =
          Math.max(...this.children.map((c) => c.drawWidth)) +
          this.padding.x * 2;
    }
    if (this.height == null) {
      if (!isRow) this.drawHeight = offset - this.gap + this.padding.y;
      else
        this.drawHeight =
          Math.max(...this.children.map((c) => c.drawHeight)) +
          this.padding.y * 2;
    }
  }

  draw(ctx, x = 0, y = 0) {
    const absX = (this.parent?.position.x ?? 0) + this.position.x + x;
    const absY = (this.parent?.position.y ?? 0) + this.position.y + y;

    if (this._dirty) {
      this.computeTextMetrics(ctx, absX, absY);
      this._dirty = false;
    }

    this.computeChildrenLayout(ctx, absX, absY);
    this.drawBackground(ctx, absX, absY);
    this.children.forEach((child) => child.draw(ctx, absX, absY));
  }
}
