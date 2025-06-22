export class Input {
  constructor(canvas, dpr) {
    this.dpr = dpr;
    this.canvas = canvas;

    this.keys = {};
    this.pressedKey = null;
    this.ctrlKey = false;

    this.mouse = {
      x: 0,
      y: 0,
      isDown: false,
      wasClicked: false,
      clickX: null,
      clickY: null,
    };

    this.clipboardData = null;

    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
      this.pressedKey = e.key;

      this.ctrlKey = e.ctrlKey || e.metaKey;
    });
    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;

      this.ctrlKey = e.ctrlKey || e.metaKey;
    });

    window.addEventListener("paste", (e) => {
      const pasted = (e.clipboardData || window.clipboardData).getData("text");
      this.clipboardData = pasted;
    });

    canvas.addEventListener("mousemove", (e) => {
      const pos = this.getPos(e);
      this.mouse.x = pos.x;
      this.mouse.y = pos.y;
    });

    canvas.addEventListener("mousedown", (e) => {
      this.mouse.isDown = true;
    });

    canvas.addEventListener("mouseup", (e) => {
      const pos = this.getPos(e);
      this.mouse.clickX = pos.x;
      this.mouse.clickY = pos.y;

      this.mouse.wasClicked = true;
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
    this.mouse.clickX = null;
    this.mouse.clickY = null;
  }

  resetPressedKey() {
    this.pressedKey = null;
  }

  resetKeys() {
    this.keys = {};
  }

  getAndResetClipboardData() {
    const data = this.clipboardData;
    this.clipboardData = null;
    return data;
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
