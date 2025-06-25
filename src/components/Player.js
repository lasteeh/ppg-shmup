import { GameObject } from "../GameObject.js";

export class Player extends GameObject {
  constructor({ id, name, position, isSelf = false }) {
    super({ position });

    this.id = id;
    this.name = name;
    this.isSelf = isSelf;

    this.frameSize = 16;
    this.speed = 6;

    this.baseColor = isSelf ? "blue" : "red";
    this.altColor = isSelf ? "darkblue" : "darkred";
    this.color = this.baseColor;

    // animations
    this.elapsedTime = 0;
    this.animationInterval = 500; // 1 second in ms

    // limit socket exchange
    this._lastPosition = null;
  }

  step(delta, root) {
    const { game } = root;

    this.elapsedTime += delta;

    if (this.elapsedTime > this.animationInterval) {
      this.color =
        this.color === this.baseColor ? this.altColor : this.baseColor;
      this.elapsedTime = 0;
    }

    this.move(delta, root);

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

    const moved =
      this.position.x !== this._lastPosition?.x &&
      this.position.y !== this._lastPosition?.y;

    if (moved && this.isSelf && game?.socket?.readyState === WebSocket.OPEN) {
      const payload = {
        type: "move-player",
        id: this.id,
        position: { x: this.position.x, y: this.position.y },
      };

      game?.socket?.send(JSON.stringify(payload));
    }

    this._lastPosition = { x: this.position.x, y: this.position.y };
  }

  move(delta, root) {
    if (!this.isSelf) return;

    const { input } = root;

    let dx = 0;
    let dy = 0;

    if (input?.keys["ArrowUp"] || input?.keys["w"]) dy -= 1;
    if (input?.keys["ArrowDown"] || input?.keys["s"]) dy += 1;
    if (input?.keys["ArrowLeft"] || input?.keys["a"]) dx -= 1;
    if (input?.keys["ArrowRight"] || input?.keys["d"]) dx += 1;

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
