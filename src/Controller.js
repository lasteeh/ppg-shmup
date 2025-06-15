import { GameObject } from "./GameObject.js";

export class Controller extends GameObject {
  constructor(object) {
    super({});

    this.object = object;
    this.keys = {};

    document.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
    });
    document.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });
  }

  step(delta) {
    let dx = 0;
    let dy = 0;

    if (this.keys["ArrowUp"] || this.keys["w"]) dy -= 1;
    if (this.keys["ArrowDown"] || this.keys["s"]) dy += 1;
    if (this.keys["ArrowLeft"] || this.keys["a"]) dx -= 1;
    if (this.keys["ArrowRight"] || this.keys["d"]) dx += 1;

    if (dx !== 0 || dy !== 0) {
      const length = Math.sqrt(dx * dx + dy * dy);
      dx /= length;
      dy /= length;
    }

    const speed = this.object.speed || 1;
    this.object.position.x += dx * speed;
    this.object.position.y += dy * speed;
  }
}
