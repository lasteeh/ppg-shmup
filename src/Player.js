import { Controller } from "./Controller.js";
import { GameObject } from "./GameObject.js";

export class Player extends GameObject {
  constructor({ position }) {
    super({ position });

    this.frameSize = 16;
    this.speed = 2;
    this.color = "blue";

    // animations
    this.elapsedTime = 0;
    this.animationInterval = 500; // 1 second in ms

    const controller = new Controller(this);
    this.addChild(controller);
  }

  step(delta, root) {
    this.elapsedTime += delta;

    if (this.elapsedTime > this.animationInterval) {
      this.color = this.color === "blue" ? "darkblue" : "blue";
      this.elapsedTime = 0;
    }

    // prevent player from going off screen
    const bounds = root.bounds;
    this.position.x = Math.max(
      0,
      Math.min(this.position.x, bounds.width - this.frameSize)
    );
    this.position.y = Math.max(
      0,
      Math.min(this.position.y, bounds.height - this.frameSize)
    );
  }

  drawImage(ctx, x, y) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.position.x,
      this.position.y,
      this.frameSize,
      this.frameSize
    );
  }
}
