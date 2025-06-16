export class Input {
  constructor(canvas, scale) {
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
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = (e.clientX - rect.left) / scale;
      this.mouse.y = (e.clientY - rect.top) / scale;
    });

    canvas.addEventListener("mousedown", (e) => {
      this.mouse.isDown = true;
      this.mouse.wasClicked = true;
    });

    canvas.addEventListener("mouseup", (e) => {
      this.mouse.isDown = false;
      this.mouse.wasClicked = false;
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
}
