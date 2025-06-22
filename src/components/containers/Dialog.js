import { Container } from "../Container.js";

export class Dialog extends Container {
  constructor({ ...options }) {
    super({ ...options });

    this.hidden = true;
  }

  show() {
    this.hidden = false;
  }

  hide() {
    this.hidden = true;
  }

  draw(ctx, x, y) {
    if (this.hidden) return;

    super.draw(ctx, x, y);
  }
}
