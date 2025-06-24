import { Vector2 } from "./Vector2.js";

export class GameObject {
  constructor({ position, zIndex = 0 }) {
    this.position = position ?? new Vector2(0, 0);
    this.zIndex = zIndex;

    this.children = [];
    this.parent = null;

    this._dirty = true; // flag for recompute
  }

  setProperty(property, value) {
    if (!this.hasOwnProperty(property))
      throw new Error("Property not found: " + property);

    this._dirty = true;
    this[property] = value;
  }

  attach(name, object) {
    if (this[name] !== undefined)
      throw new Error("Object already attached: " + name);

    this[name] = object;
  }

  stepEntry(delta, root) {
    this.children
      .slice()
      .sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0))
      .forEach((child) => {
        child.stepEntry(delta, root);
      });
    this.step(delta, root);
  }

  step(_delta) {
    // defined by child
  }

  draw(ctx, x, y) {
    const drawPosX = this.position.x;
    const drawPosY = this.position.y;

    this.drawImage(ctx, drawPosX, drawPosY);

    this.children
      .slice()
      .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
      .forEach((child) => child.draw(ctx, drawPosX, drawPosY));
  }

  drawImage(ctx, x, y) {
    // defined by child
  }

  destroy() {
    this.children.forEach((child) => child.destroy());
    this.parent?.removeChild(this);
  }

  addChild(gameObject) {
    gameObject.parent = this;
    this.children.push(gameObject);
  }

  removeChild(gameObject) {
    this.children = this.children.filter((child) => {
      return gameObject !== child;
    });
  }
}
