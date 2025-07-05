import { GameObject } from "../GameObject.js";
import { Vector2 } from "../Vector2.js";

export class Obstacle extends GameObject {
  constructor({ position, width = 50, height = 50, color = "pink" }) {
    super({ position });

    this.width = width;
    this.height = height;
    this.color = color;
  }

  step(delta, root) {
    const { scrollSpeed } = root;

    this.position.x -= scrollSpeed;

    if (this.position.x + this.width < 0) {
      this.destroy();
    }
  }

  drawImage(ctx, x, y) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  getBounds() {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height,
    };
  }
}
