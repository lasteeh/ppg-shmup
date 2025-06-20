export class Input {
  constructor(canvas, dpr) {
    this.dpr = dpr;
    this.canvas = canvas;

    this.keys = {};
    this.mouse = {
      x: 0,
      y: 0,
      isDown: false,
      wasClicked: false,
    };

    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
    });
    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });

    canvas.addEventListener("mousemove", (e) => {
      const pos = this.getPos(e);
      this.mouse.x = pos.x;
      this.mouse.y = pos.y;
    });

    canvas.addEventListener("mousedown", (e) => {
      this.mouse.isDown = true;
      this.mouse.wasClicked = true;
    });

    canvas.addEventListener("mouseup", (e) => {
      this.mouse.wasClicked = false;
      this.mouse.isDown = false;
    });
  }

  isMouseDown() {
    return this.mouse.isDown === true;
  }

  wasClicked() {
    return this.mouse.wasClicked === true;
  }

  resetClick() {
    this.mouse.wasClicked = false;
  }

  getPos = (e) => {
    const rect = this.canvas.getBoundingClientRect();
    // rect.width/height are CSS pixels; canvas.width/height are backing‐store pixels
    // multiplying by dpr maps CSS→backing‑store, then dividing by dpr gives logical coords
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: ((e.clientX - rect.left) * scaleX) / this.dpr,
      y: ((e.clientY - rect.top) * scaleY) / this.dpr,
    };
  };
}
