import { Vector2 } from "./Vector2.js";

export class GameObject {
  constructor({ position }) {
    this.position = position ?? new Vector2(0, 0);
    this.children = [];
    this.parent = null;
  }

  stepEntry(delta, root) {
    this.children.forEach((child) => {
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

    this.children.forEach((child) => {
      child.draw(ctx, drawPosX, drawPosY);
    });
  }

  drawImage(ctx, x, y) {
    // defined by child
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
