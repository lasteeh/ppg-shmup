import { GameObject } from "./GameObject.js";

export class Player extends GameObject {
  constructor({ position, input }) {
    super({ position });

    this.input = input;

    this.frameSize = 16;
    this.speed = 2;
    this.color = "blue";

    // animations
    this.elapsedTime = 0;
    this.animationInterval = 500; // 1 second in ms
  }

  step(delta, root) {
    this.elapsedTime += delta;

    if (this.elapsedTime > this.animationInterval) {
      this.color = this.color === "blue" ? "darkblue" : "blue";
      this.elapsedTime = 0;
    }

    this.move(delta);

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

  move(delta) {
    let dx = 0;
    let dy = 0;

    if (this.input?.keys["ArrowUp"] || this.input?.keys["w"]) dy -= 1;
    if (this.input?.keys["ArrowDown"] || this.input?.keys["s"]) dy += 1;
    if (this.input?.keys["ArrowLeft"] || this.input?.keys["a"]) dx -= 1;
    if (this.input?.keys["ArrowRight"] || this.input?.keys["d"]) dx += 1;

    if (dx !== 0 || dy !== 0) {
      const length = Math.sqrt(dx * dx + dy * dy);
      dx /= length;
      dy /= length;
    }

    const speed = this.speed || 1;
    this.position.x += dx * speed;
    this.position.y += dy * speed;
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
